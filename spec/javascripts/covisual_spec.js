describe("covisualTest", function() {
	beforeEach(function() {
	/* Create some DIVs so we can test JS interaction */
	$('body').remove('#covistest');
	$('body').append('<canvas id="covistest" playtime="0"></canvas>');

	/* Init the covisual library so we can test it */
	timeline = new TimeLine('#covistest');
	timeline.setData();
	timeline.setOptions();
	timeline.init();

  	});

	it("should have data, options, and target set correctly and accessible", function() {
		expect(timeline.getRuntime().data).toEqual({});
		expect(timeline.getRuntime().options).toEqual({});
		expect(timeline.getRuntime().target[0].id).toEqual('covistest');
	});
	
	it("should be able to change data", function() {
		timeline.setData({});
		expect(timeline.getRuntime().data).toEqual({});
	});

	it("should be able to set options", function() {
		timeline.setOptions({});
		expect(timeline.getRuntime().options).toEqual({});
	});
	
	it("should re-render upon updating offset", function () {
		timeline.setOffset(10);
		expect($('#covistest').attr('playtime')).toEqual("10");
		expect(timeline.getRuntime().offset).toEqual(10);
	});

});