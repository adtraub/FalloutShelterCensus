var expect    = require("chai").expect;
var tools = require("../app/js/tools");

describe("Health Tools Checker", function() {
  describe("Calculate Health From Level and Endurance", function() {
    it("calculates health from Health and Endurance", function() {
      var lowest = tools.calculateAverageEndurance(252,50);
      var average = tools.calculateAverageEndurance(374.5,50);
      var good = tools.calculateAverageEndurance(472.5,50);
      var veryGood = tools.calculateAverageEndurance(595,50);
      var perfect = tools.calculateAverageEndurance(644,50);

      expect(lowest).to.equal(1);
      expect(average).to.equal(6);
      expect(good).to.equal(10);
      expect(veryGood).to.equal(15);
      expect(perfect).to.equal(17);
    });
  });
});
