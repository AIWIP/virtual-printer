const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const Printer = require('ipp-printer')
const snmp = require('snmpjs')
const os = require('os')

const MIB_OID_HOSTNAME = ".1.3.6.1.2.1.1.5"
const MIB_OID_DEVICE_STATE = ".1.3.6.1.2.1.25.3.2.1.5"
const MIB_OID_PRINTER_STATE = ".1.3.6.1.2.1.25.3.5.1.1"
const MIB_OID_INPUT_LEVELS = ".1.3.6.1.2.1.43.8.2.1.10.1"
const MIB_OID_INPUT_NAMES = ".1.3.6.1.2.1.43.8.2.1.18.1"
const MIB_OID_MARKER_NAMES = ".1.3.6.1.2.1.43.11.1.1.6.1"
const MIB_OID_MARKER_LEVELS = ".1.3.6.1.2.1.43.11.1.1.9.1"
const MIB_OID_ALERTS = ".1.3.6.1.2.1.43.18.1.1"

const ipp_port = 9100
const snmp_port = 161
const web_port = 5000

const printer = new Printer({
    name: 'PrinterSim',
    port: ipp_port,
    zeroconf: false,
    fallback: true
})

const agent = snmp.createAgent()
const app = express()

var is_printing = false
var has_ink = true
var has_paper = true
var jobs = []

printer.on('job', function (job) {

    console.log('Received Print Job')

    job.attributes().forEach(function(attribute) {
        console.log(attribute.name + "=" + attribute.value)
    }, this);
        
    is_printing = true

    var job_id = job.id

    printjob = {
        "id": job_id ,
        "name": job.name,
        "href": "#",
        "status": "Downloading"
    }

    jobs.push(printjob)

    var filename = 'job-' + job.id + '.ps'
    var file = fs.createWriteStream('public/printjobs/' + filename)

    job.on('end', function () {

        var job = jobs[job_id - 1]
        
        job.status = "Printed"
        job.href = 'printjobs/' + filename

        console.log('written job to', filename)

        is_printing = false
    })

    job.pipe(file)
})

printer.on('error', function(error) {
    console.log("Error: " + error)
})

agent.request({ oid: MIB_OID_HOSTNAME, handler: function (prq) {
	var nodename = os.hostname();
	var val = snmp.data.createData({ type: 'OctetString', value: nodename });

	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_PRINTER_STATE, handler: function (prq) {
	var MIB_PRINTER_STATE_IDLE = 3
    var MIB_PRINTER_STATE_PRINTING = 4

	var val = snmp.data.createData({ type: 'Integer', value: (is_printing) ? MIB_PRINTER_STATE_PRINTING : MIB_PRINTER_STATE_IDLE });
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_DEVICE_STATE, handler: function (prq) {
	var MIB_DEVICE_STATE_RUNNING = 2
	var val = snmp.data.createData({ type: 'Integer', value: MIB_DEVICE_STATE_RUNNING });

	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_MARKER_NAMES + ".1", handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value:"Ink"});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_MARKER_LEVELS + ".1", handler: function (prq) {
	var val = snmp.data.createData({ type: 'Integer', value: (has_ink) ? 100 : 0});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_INPUT_NAMES + ".1", handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value:"Input Tray"});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_INPUT_LEVELS + ".1", handler: function (prq) {
	var val = snmp.data.createData({ type: 'Integer', value: (has_paper) ? -3 : 0});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_ALERTS + ".1", handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value: "0"});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_ALERTS + ".2", handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value: "0"});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_ALERTS + ".3", handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value: "0"});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_ALERTS + ".4", handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value: "0"});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_ALERTS + ".5", handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value: "0"});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_ALERTS + ".6", handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value: "0"});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_ALERTS + ".7", handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value: "0"});
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.request({ oid: MIB_OID_ALERTS + ".8", handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value: "0"});
	snmp.provider.readOnlyScalar(prq, val);
}});

// Some clients get confused by the standard end of mib response sent by snmpjs, this is a workaround
const MIB_OID_END_OF_VIEW = ".1.3.6.1.2.1.43.99.1.1.9.1"
agent.request({ oid: MIB_OID_END_OF_VIEW, handler: function (prq) {
	var val = snmp.data.createData({ type: 'OctetString', value: "0" });
	snmp.provider.readOnlyScalar(prq, val);
}});

agent.bind({ family: 'udp4', port: snmp_port });

app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/printer', function (req, res) {
    res.send({
        'has_ink': has_ink,
        'has_paper': has_paper,
        'jobs': jobs
    })
})

app.post('/printer', function (req, res) {

    var json = req.body

    has_ink = json.has_ink
    has_paper = json.has_paper

    res.send({
        'has_ink': has_ink,
        'has_paper': has_paper,
        'jobs': jobs
    })
})

app.listen(web_port, function () {
  console.log('Frontend listening on port ' + web_port)
})

console.log('IPP listening on port ' + ipp_port)
console.log('SNMP listening on port ' + snmp_port)