package cn.jintongsoft.kb.admin.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * Created by bys on 2017-08-17.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RuleDetail implements Serializable {
    private String ruleName;
    private List<RuleConditionOrConclusion> condition;
    private List<RuleConditionOrConclusion> conclusion;
}
