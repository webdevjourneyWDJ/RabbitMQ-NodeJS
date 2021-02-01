const amqplib = require('amqplib');

const exchangeName = "topic_logs";
const args = process.argv.slice(2);
const msg = args[1] || 'Subscribe, Like, Comment';
const key = args[0]

console.log(args, msg);

const sendMsg = async () => {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertExchange(exchangeName, 'topic', {durable: false});
  channel.publish(exchangeName, key, Buffer.from(msg));
  console.log('Sent: ', msg);
  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500)
}

sendMsg();