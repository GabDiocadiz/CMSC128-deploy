import assert from "assert";
import {expect} from "chai";

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
    it('should have length of 3', function () {
        expect([1,2,3]).to.have.lengthOf(3);
    })
  });
});
