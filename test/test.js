const { server } = require("../index"); //your server wrapper
const { keploy } = require("typescript-sdk/dist/integrations/express/register");
const { describe, test, before, after } = require("mocha");
describe("test function", () => {
  before((done) => {
    keploy.setTestMode();
    server();
    done();
  });
  test("should be running", async () => {
    return keploy.assertTests();
  });
  after(() => {
    process.exit(1); //exits the node server
  });
});
