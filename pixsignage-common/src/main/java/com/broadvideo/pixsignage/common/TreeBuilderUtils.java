package com.broadvideo.pixsignage.common;

import java.util.List;

import org.apache.commons.lang.ObjectUtils;
import org.apache.commons.lang.StringUtils;

/**
 * 自动构件树状结构工具类：构件对象需要传入id,parentId
 * 
 * @author charles
 *
 */
public class TreeBuilderUtils {
	/**
	 * 生成树状结构
	 * 
	 * @param parent
	 *            根节点对象
	 * @param childs
	 *            离散的子节点
	 * @param pIdFieldname
	 *            对象中代表父节点的字段名
	 * @param idFieldName
	 *            对象中代表该节点的字段名
	 */
	public static void buildTree(Object parent, List childs, String pidName, String idName, String subListName) {
		if (childs == null || childs.size() == 0) {

			return;
		}

		for (int i = 0; i < childs.size(); i++) {
			Object item = childs.get(i);
			Object childOfPId = ReflectionUtils
					.getFieldValue(item, StringUtils.isEmpty(pidName) ? "parentId" : pidName);
			Object parentOfId = ReflectionUtils.getFieldValue(parent, StringUtils.isEmpty(idName) ? "id" : idName);
			if (ObjectUtils.toString(childOfPId).equals(ObjectUtils.toString(parentOfId))) {
				List subList = (List) ReflectionUtils.getFieldValue(parent, subListName);
				subList.add(item);
				buildTree(item, childs, pidName, idName, subListName);
			}

		}

	}
}
