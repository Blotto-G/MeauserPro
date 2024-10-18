package com.example.meausrepro_app.db

import com.example.meausrepro_app.db.dto.ManagementDTO
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface MeausreProInterface {
    // 로그인
    @POST("MeausrePro/User/AppLogin")
    fun login(@Body user: MeausreProUser):Call<MeausreProUser>

    // 진행 중인 프로젝트 모두 보기
    @GET("MeausrePro/Project/appInProgress/{id}")
    fun getProject(@Path("id") id:String):Call<List<MeausreProProject>>

    // 프로젝트 구간 보기
    @GET("MeausrePro/Section/{projectId}")
    fun getSection(@Path("projectId") projectId:Int):Call<List<MeausreProSection>>

    // 구간 별 계측기 보기
    @GET("MeausrePro/Instrument/section/{sectionId}")
    fun getInstrument(@Path("sectionId") sectionId: Int):Call<List<MeausreProInstrument>>

    // 계측기 정보
    @GET("MeausrePro/Instrument/get/{idx}")
    fun getInstrumentInfo(@Path("idx") idx:Int):Call<MeausreProInstrument>

    // 계측기 관리 값 저장
    @POST("MeausrePro/Management/save/{instrIdx}")
    fun saveManagement(@Body request: ManagementDTO, @Path("instrIdx") instrIdx:Int):Call<MeausreProManType>

    // 계측기 접근
    @GET("MeausrePro/Instrument/access/{idx}/{userId}")
    fun accessInstrument(@Path("idx") idx:Int, @Path("userId") userId:String):Call<Boolean>
}