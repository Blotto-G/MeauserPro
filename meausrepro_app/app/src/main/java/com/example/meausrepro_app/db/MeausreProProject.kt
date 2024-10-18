package com.example.meausrepro_app.db

data class MeausreProProject(var idx:Int?, var sections:List<MeausreProSection>?,
                             var userIdx: MeausreProUser, var companyIdx: MeausreProCompany,
                             var siteName:String, var siteAddress:String,
                             var startDate:String, var endDate:String,
                             var contractor:String, var measure:String,
                             var siteCheck:Char, var geometry:String ) {
}