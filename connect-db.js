import { connect } from "mongoose";
import mongoose from 'mongoose';

const mongo_username = "yoonuooh";
const mongo_password = "70005812";

connect(`mongodb+srv://${mongo_username}:${mongo_password}@noticeboard.joumi.mongodb.net/?retryWrites=true&w=majority&appName=NoticeBoard`)
  .then(() => console.log("Connected!"))
  .catch(() => console.log("Failed.."))

const NoticeSchema = new mongoose.Schema({
  name: String,
  title: String,
  created_at: String,
  modified_at: String,
  content: mongoose.Schema.Types.Mixed,
  category: String,
});
export const Regulation = mongoose.model('regulation', NoticeSchema);
export const FreeNotice = mongoose.model('free_notice', NoticeSchema);
export const Document = mongoose.model('document', NoticeSchema);
export const Wiki = mongoose.model('wiki', NoticeSchema);
export const ProjectDashboard = mongoose.model('project_dashboard', NoticeSchema);
export const DesignAutomation = mongoose.model('design_automation', NoticeSchema);