require("dotenv").config();
var express = require("express");
const bodyParser = require("body-parser");
var app = express();
const InitiateMongoServer = require("./config/db");

const User = require("./model/User");

InitiateMongoServer();
app.use(bodyParser.json());

const WA_SENDER_ID_FIELD = "wa";
const TG_SENDER_ID_FIELD = "tg";
const FB_SENDER_ID_FIELD = "fb";
const USER_ID_FIELD = "_id";

app.get("/", function (req, res) {
  res.status(200).send("Welcome home");
});

app.post("/register/user", async (req, res) => {
  try {
    const allowed_payload_fields = [
      "user_first_name",
      "user_last_name",
      "user_type",
      "user_email",
      "user_mobile",
      "user_tg",
      "user_fb",
      "user_wa",
      "user_org_name",
      "whatsapp_name",
      "branch_name",
    ];
    const channel_sender_id_keys = {
      whatsapp: WA_SENDER_ID_FIELD,
      telegram: TG_SENDER_ID_FIELD,
      facebook: FB_SENDER_ID_FIELD,
    };
    let { sender_id, channel } = req.body;
    if (sender_id && channel) {
      const channel_key = channel_sender_id_keys[channel];
      let user_payload = {};
      let return_payload = {};
      for (let i = 0; i < allowed_payload_fields.length; i++) {
        let field_value = req.body.payload[allowed_payload_fields[i]];

        if (field_value) {
          field_name = allowed_payload_fields[i].replace("user_", "");

          if (field_name == "org_name") {
            field_name = "user_" + field_name;
          }
          if (field_name == "whatsapp_name") {
            user_payload = { ...user_payload, whatsapp_name_verified: false };
          }

          if (field_name in ["wa", "tg", "fb"]) {
            field_value = re.sub("W+", "", field_value);
          }

          if (field_name == channel_key) {
            field_value = sender_id;
          }
          if (field_name in ["mobile"]) {
            field_value = field_value.replace(" ", "").replace("+", "").strip();
            if (field_value.length == 10) field_value = `+91${field_value}`;
            if (field_value.length == 12) field_value = field_value;
          }

          user_payload[field_name] = field_value;
          channel = `${channel}_verified`;
        }
      }

      user_payload[channel] = true;
      user_payload["created_at"] = new Date().toUTCString();
      const result = await User.find({ email: user_payload.email });
      if (result.length > 0) {
        console.log("user already exits");
        return res.status(400).json({ ok: false, msg: "User already exits" });
      } else {
        const user = await new User({
          created_at: { date: user_payload.created_at },
          email: user_payload.email,
          wa: sender_id,
          whatsapp_verified: user_payload.whatsapp_verified,
          branch_name: user_payload.branch_name,
        });
        await user.save();
        console.log(user);
        return_payload["msg"] = "User was registered";
        return_payload["ok"] = true;
        return_payload["user"] = user;
        return res.status(200).send(return_payload);
      }
    } else {
      return res.status(500).json({ ok: false, msg: "Internal server error" });
    }
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
});

var httpPORT = process.env.PORT || 4000;

app.listen(httpPORT, "192.168.238.41", function () {
  console.log("Server is listening on port: " + httpPORT);
});
