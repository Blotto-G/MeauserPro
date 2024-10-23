package com.example.meausrepro_app.db

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object MeausreProClient {
    val retrofit: MeausreProInterface = Retrofit.Builder()
        .baseUrl("http://10.100.105.217:8080/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(MeausreProInterface::class.java)
}