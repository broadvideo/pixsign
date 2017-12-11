package biz.videoexpress.pixedx.lmsapi.service;

import java.util.concurrent.locks.ReentrantReadWriteLock;

import org.springframework.stereotype.Component;

import biz.videoexpress.pixedx.lmsapi.common.UserProfile;

import com.mysql.jdbc.util.LRUCache;

/**
 * User profile cache(LRU), only persist latest 100 user's profile.
 * 
 * @author foxty
 *
 */
@Component
public class UsersCache {

	private LRUCache users = new LRUCache(100);
	private ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

	public void addUser(String authHeader, UserProfile profile) {
		users.putIfAbsent(authHeader, profile);
	}

	/**
	 * Key is the "token_type token" which present user's login evidence
	 * 
	 * @param key
	 */
	public UserProfile getUser(String authHeader) {
		lock.readLock().lock();
		UserProfile p;
		try {
			p = (UserProfile) users.get(authHeader);
		} finally {
			lock.readLock().unlock();
		}
		return p;
	}

	public UserProfile removeUser(String authHeader) {
		lock.writeLock().lock();
		UserProfile p;
		try {
			p = (UserProfile) users.remove(authHeader);
		} finally {
			lock.writeLock().unlock();
		}
		return p;
	}
}
