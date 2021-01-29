const amqplib = require('amqplib');

const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}


const exchangeName = "direct_logs";

const recieveMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, 'direct', {durable: false});
  const q = await channel.assertQueue('', {exclusive: true});
  console.log(`Waiting for messages in queue: ${q.queue}`);
  args.forEach(function(severity) {
    channel.bindQueue(q.queue, exchangeName, severity);
  });
  channel.consume(q.queue, msg => {
    if(msg.content) console.log(`Routing Key: ${msg.fields.routingKey}, Message: ${msg.content.toString()}`);
  }, {noAck: true})
}

recieveMsg();