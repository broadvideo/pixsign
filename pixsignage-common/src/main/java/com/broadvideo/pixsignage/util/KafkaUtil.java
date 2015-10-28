package com.broadvideo.pixsignage.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.concurrent.Future;

import kafka.consumer.ConsumerConfig;
import kafka.javaapi.consumer.ConsumerConnector;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.log4j.Logger;

public class KafkaUtil {

	private static Logger logger = Logger.getLogger(KafkaUtil.class);
	private static KafkaProducer<String, String> kafkaProducer = null;
	private static ConsumerConnector kafkaConsumer = null;
	
	public synchronized static KafkaProducer<String, String> getProducer() 
		throws IOException {
		if (kafkaProducer == null) {
			Properties props = new Properties();
			InputStream inputStream = Thread.currentThread().getContextClassLoader().getResource("producer.properties").openStream();
			props.load(inputStream);
			kafkaProducer = new KafkaProducer<String, String>(props);
		}
		return kafkaProducer;
	}
	
	public synchronized static ConsumerConnector getConsumer()
		throws IOException {
		if (kafkaConsumer == null) {
			Properties props = new Properties();
			InputStream inputStream=Thread.currentThread().getContextClassLoader().getResource("consumer.properties").openStream();
			props.load(inputStream);
			kafkaConsumer=  kafka.consumer.Consumer.createJavaConsumerConnector(new ConsumerConfig(props));
		}
		return kafkaConsumer;
	}
	
	public static RecordMetadata publish(String topicName, String msgValue) 
		throws Exception {
		KafkaProducer<String, String> kafkaProducer = getProducer();
		ProducerRecord<String,String> producerRecord = new ProducerRecord<String, String>(topicName, "key", msgValue);
		Future<RecordMetadata> results = kafkaProducer.send(producerRecord);
		return results.get();
	}
}
