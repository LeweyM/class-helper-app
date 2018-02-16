const app = require('express')();
const server = require('http').Server(app);
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser= require('body-parser')
let db

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

MongoClient.connect('mongodb://leweyMetcalf:numberwang@ds125288.mlab.com:25288/teacher-aid-app', (err, client) => {
		// ... start the server
		if (err) return console.log(err)
		db = client.db('teacher-aid-app')
		server.listen(5000);
	})

function quickConsole(obj) {
	console.log(JSON.stringify(obj, null, 4));
}

app.get('/api/lesson/:lid', (req, res) => {
	db.collection('activities')
	.findOne( { "_id": new ObjectID(req.params.lid) } )
	.then(result => {
		res.send(result)
	})
	.catch(e => {
		console.error(e);
	})
})

app.post('/api/activities', (req, res) => {
	const newActivity = req.body
	newActivity.created = new Date()
	db.collection('activities').save(req.body, (err, result) => {
		if (err) return console.log(err)
		console.log('saved to db')
		res.redirect('/')
	})
})

app.get('/api/allLessons', (req, res) => {
  db.collection('activities').find().toArray((err, lessons) => {
    if (err) return console.log(err)
    res.send({lessons})
  })
})

app.put('/api/activity', (req, res) => {
	db.collection('activities').findOneAndUpdate(
		{ _id: new ObjectID(req.body._id) },
		{ $set: {
			title: req.body.title,
			content: req.body.content
		}})
		.then(result => {
			res.send(result)
		})
})

app.delete('/api/activity/:id', (req, res) => {
	let activityId;
	try {
		activityId = new ObjectID(req.params.id)
	} catch (err) {
		res.status(422).json({ message: `internal server error: ${err}`})
		return
	}

	db.collection('activities').deleteOne({ _id: activityId })
		.then((deleteResult => {
			if(deleteResult.result.n === 1) res.json({ status: 'OK'})
			else res.json({ status: 'Warning: Object not found'})
		}))
		.catch(err => {
			console.log(err)
			res.status(500).json({ message: `internal Server Error: ${err}`})
		})
	
})

//socket

//TODO: Ensure Unique (maybe when adding to lookup table?)
function generatePin() {
	let pin = ""
	for (let i = 0; i < 6; i++) {
		pin += Math.floor(Math.random() * 10)
	}
	return pin
}

var io = require('socket.io')(server);
// server.listen(5000);
io.on('connection', function (socket) {

  socket.on('createNewLesson', function (lessonId) {

	let roomData = {
			studentData: {
				teacherId: socket.id, // add teacher id to room
				teacherName: "",
				studentIds: [],
				studentNames: [],
				},
			lessonId: lessonId,
			pin: generatePin(),
			roomId: socket.id,
			leadPage: 0,
			//lesson state, such as 'room.pageCount' or 'room.hasStarted'
		}
	io.sockets.adapter.rooms[socket.id].roomData = roomData

  });

  socket.on('joinLobby', function (roomId) {
  	const room = io.sockets.adapter.rooms[roomId];
  	if(room) {
	  	socket.emit('updateLobby', room.roomData)
  	} 
  	if (!room || !room.roomData) {
  		socket.emit('noRoom')
  	}
  });

  socket.on('nameUpdate', function(name, isTeacher, roomId) {
  	const room = io.sockets.adapter.rooms[roomId];
  	socket.name = name;
  	if (room) {
  	  	if(isTeacher) { 
  	  		room.roomData.studentData.teacherName = name 
  	  	} else {
			room.roomData.studentData.studentNames.push(name)
  	  	}
		io.in(roomId).emit('updateLobby', room.roomData)
	}
  })

  socket.on('leadPageUpdate', function(page, roomId) {
  	const room = io.sockets.adapter.rooms[roomId];

  	room.roomData.leadPage = page

  	//some broadcast event to othe sockets
  	io.in(roomId).emit('pageChanged', page)
  })

  socket.on('checkPin', function (pinAttempt) {
	//search through room pins
	const rooms = io.sockets.adapter.rooms;
	let pinFound = false;
	for (let roomId in rooms) {
		if(rooms[roomId].roomData) {
			if(rooms[roomId].roomData.pin === pinAttempt) {

				//add socket to lesson Room
				socket.join(roomId, () => {
					rooms[roomId].roomData.studentData.studentIds.push(socket.id)
					//catch errors here
				});
				socket.emit('updateLobby', rooms[roomId].roomData)
				return pinFound = true;
			} 
		}
	}
	if (pinFound == false) {
		socket.emit('pinFail')
	}
  })

  socket.on('disconnecting', function () {
  	for (let roomId in io.sockets.adapter.rooms) {
  		let room = io.sockets.adapter.rooms[roomId]
  		if (room.roomData) {
  			let studentData = room.roomData.studentData
  			if (studentData.teacherId == socket.id) {
  				//teacher has left
  				console.log('teacher has left the room!')
  			} 
  			let changed = false
  			studentData.studentIds.forEach((studentId, i) => {
  				if (studentId == socket.id) {
  					studentData.studentIds.splice(i, 1)
  					changed = true;
  					return
  				}
  			})
  			studentData.studentNames.forEach((studentName, i) => {
  				if (studentName == socket.name) {
  					studentData.studentNames.splice(i, 1)
  					changed = true;
  					return
  				}
  			})
  			if (changed) {
  				io.in(roomId).emit('studentChange', studentData)
  			}
  		}
  	}

  });

});