package com.example.meausrepro_app.db

data class MeausreProManagement(var idx:Int?,
                                var instrId: MeausreProInstrument,
                                var instrType:Char, var createDate:String,
                                var comment:String?)
