package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class ClassCreate @JsonCreator constructor(val label: String, val lang: String, val subClassOf: String?) {
}