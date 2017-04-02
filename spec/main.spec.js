
describe('Базовый функционал', function(){
	
	var _
		, taskqueue
	;
	
	beforeEach(function(){
		
		taskqueue = require('./../azbn-task-queue');
		
	});
	
	it('Существование объекта и нужных функций', function(done) {
		
		expect(typeof taskqueue == 'object').toBe(true);
		expect(typeof taskqueue.add == 'function').toBe(true);
		expect(typeof taskqueue.next == 'function').toBe(true);
		done();
		
	});
	
	it('Порядок наступления моментов при выполнении 1 задания', function(done) {
		
		var t0, t1, t2;
		
		t0 = new Date().getTime();
		
		var pause = 1000;
		
		taskqueue
			.add(function(afterTask){
				
				t1 = new Date().getTime();
				
				expect(typeof afterTask == 'function').toBe(true);
				expect(taskqueue.inAction).toBe(true);
				expect(taskqueue.tasksInQueue).toBe(0);
				expect(taskqueue.tasksFinished).toBe(0);
				
				afterTask('test');
				
			}, pause, function(res){
				
				expect(res).toBeDefined(true);
				expect(res[0]).toEqual('test');
				
				//console.log('cb' + new Date().getTime());
				
				t2 = new Date().getTime();
				
				expect((t1 - t0) > (pause * 1) || (t1 - t0) == (pause * 1)).toBe(true);
				expect((t2 - t1) < (pause * 2)).toBe(true);
				expect((t2 - t0) > (pause * 1)).toBe(true);
				
				//console.log(t0);
				//console.log(t1);
				//console.log(t2);
				
				done();
				
			});
		
	});
	
	it('Работа с setTimeout', function(done) {
		
		var pause = 1000;
		
		setTimeout(function(){
			taskqueue
				.add(function(afterTask){
					
					setTimeout(function(){
						afterTask('test2');
					}, pause);
					
				}, pause, function(res){
					
					expect(res).toBeDefined(true);
					expect(res[0]).toEqual('test2');
					
					done();
					
				});
		}, pause);
		
		
		
	});
	
});