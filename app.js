const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date  = require(__dirname + '/public/module/date');
const _ = require('lodash');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// Static Middleware
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://kumaryogesh:GBtb4d6cWMsoZ8Os@cluster1.fljuspy.mongodb.net/todoListDB', {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemSchema);
const listSchema = {
    name: String,
    items: [itemSchema]
};
const List = mongoose.model("List", listSchema);

app.get('/', (req, res) => {
    Item.find({}, (err, foundItems) => {
        if(err) throw err;
        else {
            res.render("body", {listTitle: "Today's Tasks", newItems: foundItems});
        }
    });
});

app.post('/', (req, res) => {
    const customListName = req.body.list;
    const item = new Item({
        name: req.body.newItem
    });
    if(customListName == "Today's") {
        item.save();
        res.redirect('/');
    } else {
        List.findOne({name: customListName}, (err, foundList)=> {
            if(!err) {
                foundList.items.push(item);
                foundList.save();
                res.redirect('/' + customListName);
            }
        });
    }
});

app.post('/delete', (req, res) => {
    const id = req.body._id;
    const listName = req.body.listName;
    if(listName == "Today's") {
        Item.findByIdAndRemove(id, (err) => {
            if (err) throw err;
            else {
                console.log("Successfully Deleted!!");
                res.redirect('/');
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName },{ $pull: { items: { _id: id}} }, (err, foundList)=> {
            if(!err) {
                res.redirect('/' + listName);
            }
        });
    }
});

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}, (err, foundList) => {
        if(!err) {
            if(!foundList) {
                // List Do not exist
                const list = new List({
                    name: customListName,
                    items: []
                });
                list.save();
                res.redirect('/' + customListName);
            } else {
                // List Already Exist
                res.render("body", {listTitle: foundList.name, newItems: foundList.items});
            }
        }
    });
});

app.listen(3000, () => {
    console.log("Connected Successfully to port :: 3000");
});
