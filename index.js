import express from "express"
import cors from "cors"
import { Notice } from "./connect-db.js"

const app = express();
const port = 5000;
app.use(cors({ origin: '*' }));
app.use(express.json());

// Insert Data
app.post("/api/insert_data", async (req, res) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const now = `${year}-${month}-${day} ${hours}:${minutes}`;

  const { name, title, content } = req.body;
  console.log(content);
  const newNotice = new Notice({
    name: name,
    title: title,
    created_at: now,
    modified_at: now,
    content: content,
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
  try {
    const result = await Notice.find({ title: { $exists: true } });
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

// Load Data
app.post("/api/load_data", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Notice.findById({ _id: id });
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
  const { id } = req.body;
  try {
    const result = await Notice.findByIdAndDelete(id);
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
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const now = `${year}-${month}-${day} ${hours}:${minutes}`;

  const { id, title, content } = req.body;
  try {
    const result = await Notice.updateOne(
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