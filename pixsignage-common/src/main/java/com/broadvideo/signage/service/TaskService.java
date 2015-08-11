package com.broadvideo.signage.service;

import java.util.List;

import com.broadvideo.signage.domain.Task;

public interface TaskService {
	public int selectCount(int orgid, int branchid, String search);
	public List<Task> selectList(int orgid, int branchid, String search, String start, String length);

	public void addTask(Task task);
	public void updateTask(Task task);
	public void deleteTask(String[] ids);
	
}
