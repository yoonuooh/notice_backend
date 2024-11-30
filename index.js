import express from "express"
import cors from "cors"
import moment from "moment-timezone"
import { Regulation, FreeNotice, Document, Wiki, ProjectDashboard, DesignAutomation } from "./connect-db.js"

const app = express();
const port = 5000;
app.use(cors({ origin: '*' }));
app.use(express.json());

moment.tz.setDefault("Asia/Seoul");

function getModel(category) {
  switch (category) {
    case "regulation":
      return Regulation;
    case "free-notice":
      return FreeNotice;
    case "wiki":
      return Wiki;
    case "document":
      return Document;
    case "project-dashboard":
      return ProjectDashboard;
    case "design-automation":
      return DesignAutomation;
    default:
      throw new Error('Invalid model type');
  }
}

// Insert Data
app.post("/api/insert_data", async (req, res) => {
  const now = moment().format('YYYY-MM-DD HH:mm');
  const { name, title, content, category } = req.body;
  const Model = getModel(category);
  const newNotice = new Model({
    name: name,
    title: title,
    created_at: now,
    modified_at: now,
    content: content,
    category: category,
  });

  try {
    const result = await newNotice.save();
    res.json({ received: result, status: 'Success' });
    console.log("Insert Data Success!");
  } catch (err) {
    console.error('Insert Data Fail:', err);
  }
});

// Load All Data
app.post("/api/load_all_data", async (req, res) => {
  const { category } = req.body;
  console.log(category);
  try {
    const Model = getModel(category);
    const result = await Model.find();
    if (result) {
      res.json(result);
      console.log("Load All Data Success!");
    } else {
      res.status(404).json({ message: 'Notice not found' });
    }
  } catch (err) {
    console.error('Load All Data Fail:', err);
  }
});

// Load Data
app.post("/api/load_data", async (req, res) => {
  const { id, category } = req.body;
  try {
    const Model = getModel(category);
    const result = await Model.findById({ _id: id });
    if (result) {
      res.json(result);
      console.log("Load Data Success!");
    } else {
      res.status(404).json({ message: 'Notice not found' });
    }
  } catch (err) {
    console.error('Load Data Fail:', err);
  }
});

// Delete Data
app.post("/api/delete_data", async (req, res) => {
  const { id, category } = req.body;
  try {
    const Model = getModel(category);
    const result = await Model.findByIdAndDelete(id);
    if (result) {
      res.json(result);
      console.log("Delete Data Success!");
    } else {
      res.status(404).json({ message: 'Notice not found' });
    }
  } catch (err) {
    console.error('Delete Data Fail:', err);
  }
});

// Update Data
app.post("/api/update_data", async (req, res) => {
  const now = moment().format('YYYY-MM-DD HH:mm');

  const { id, title, content, category } = req.body;
  try {
    const Model = getModel(category);
    const result = await Model.updateOne(
      { _id: id },
      { $set: { title: title, content: content, modified_at: now} }
    );
    res.json({ received: result, status: 'Success' });
    console.log("Update Data Success!");
  } catch (err) {
    console.error('Update Data Fail:', err);
  }
});

app.listen(port, () => console.log(`Listening on ${port}`));
