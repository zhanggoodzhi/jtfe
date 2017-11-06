package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class IndividualPropAdd @JsonCreator constructor(val type: Int, val idl: String, val prop: String, val value: String, val lang: String?) {
}
