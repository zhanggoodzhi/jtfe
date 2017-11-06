package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class ClassPropSet @JsonCreator constructor(val type: Int, val cls:String,val prop: String, val value: String, val lang: String?) {
}