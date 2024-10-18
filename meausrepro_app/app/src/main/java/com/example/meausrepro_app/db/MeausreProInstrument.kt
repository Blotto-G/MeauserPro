package com.example.meausrepro_app.db

data class MeausreProInstrument(var idx:Int?, var insType:Char,
                                var insNum:String, var insName:String,
                                var insNo:String, var insGeometry:String,
                                var createDate:String, var insLocation:String,
                                var measurement1:Double, var measurement2:Double,
                                var measurement3:Double, var verticalPlus:Double,
                                var verticalMinus:Double)
