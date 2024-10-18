package com.example.meausrepro_app.db

data class MeausreProSection(var idx:Int?, var projectId: MeausreProProject,
                             var instruments:List<MeausreProInstrument>,
                             var sectionName:String, var sectionSta:String,
                             var wallStr:String, var groundStr:String,
                             var rearTarget:String, var underStr:String,
                             var repImg:String?)
