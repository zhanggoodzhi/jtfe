package cn.jintongsoft.kb.admin.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Created by bys on 2017-08-17.
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rule implements Serializable {

    private String id;
    private String merge;
    private RuleDetail detail;

}
