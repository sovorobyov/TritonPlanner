/**
 * Created by Seiji on 1/28/2016.
 */

var data = require('../data/data.json');
data.header = "Welcome, Serhiy!";
data.image = "/images/TritonPlannerLogo.jpg";

exports.view = function(req, res) {
    res.render('index', data);
}