package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class PropCreate @JsonCreator constructor(val label: String, val lang: String, val subPropOf: String?, val type: Int) {

	var functional: Boolean? = false
}
