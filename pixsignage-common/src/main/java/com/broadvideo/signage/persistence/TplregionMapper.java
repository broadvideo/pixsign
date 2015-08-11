package com.broadvideo.signage.persistence;

import com.broadvideo.signage.domain.Tplregion;

public interface TplregionMapper {
    Tplregion selectByPrimaryKey(Integer tplregionid);

    int deleteByPrimaryKey(Integer tplregionid);
    int deleteByTpllayout(Integer tplregionid);
    int deleteByTpllayouts(String ids);

    int insert(Tplregion record);
    int insertSelective(Tplregion record);

    int updateByPrimaryKeySelective(Tplregion record);
    int updateByPrimaryKey(Tplregion record);
}