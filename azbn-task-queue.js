'use strict';

var _ = function(){}
	, util = require('util')
	, EventEmitter = require('events').EventEmitter
;

util.inherits(_, EventEmitter);

var now = function() {
	return new Date().getTime();
};

var sleep = function(milliSeconds) {
	var startTime = now();
	milliSeconds = milliSeconds || 1;
	while (now() < startTime + milliSeconds);
};

var __ = function() {
	
	//var log_name = 'azbn.task-queue';
	
	var	tasks = [];
	
	var stream = new _();
	
	stream.inAction = false;
	stream.tasksInQueue = 0;
	stream.tasksFinished = 0;
	
	stream.on('task:start', function(){
		
		stream.inAction = true;
		
		stream.tasksInQueue--;
		
	});
	stream.on('task:end', function(){
		
		stream.tasksFinished++;
		
		stream.inAction = false;
		
	});
	
	stream.add = function(t, __sleep_time, cb) {
		
		tasks.push({
			task : t,
			sleep_time : __sleep_time || 100,
			callback : cb || function(){},
		});
		
		stream.tasksInQueue++;
		
		stream.emit('task:add');
		
		// 3 очередь выполнения
		
		return stream;
		
	}
	
	stream.run = function(task) {
		
		stream.emit('task:start');
		
		sleep(task.sleep_time);
		
		var ok = function() {
			
			// 1 очередь выполнения
			task.callback(arguments);
			
			// 2 очередь выполнения
			stream.emit('task:end');
			
		};
		
		task.task(ok);
		
	}
	
	stream.next = function() {
		
		stream.inAction = false;
		
	}
	
	stream.clear = function() {
		
		tasks = [];
		
		stream.emit('task:end');
		
	}
	
	stream.on('task:add', function(){
		
		if(tasks.length) {
			
			while(stream.inAction) {}
			
			stream.run(tasks.shift());
			
		}
		
	});
	
	return stream;
	
};

module.exports = __();