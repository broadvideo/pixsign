package com.broadvideo.pixsign.service;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.stereotype.Service;

@Service
public class ServiceFactory implements BeanFactoryAware {

	private static BeanFactory _beanFactory;

	public static <T> T getBean(Class<T> beanClass) {

		return _beanFactory.getBean(beanClass);
	}

	public static <T> T getBean(Class<T> beanClass, String beanName) {

		return _beanFactory.getBean(beanName, beanClass);
	}
	@Override
	public void setBeanFactory(BeanFactory beanFactory) throws BeansException {

		_beanFactory = beanFactory;
	}


}
