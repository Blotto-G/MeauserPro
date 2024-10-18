package com.example.meausrepro_app

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.fragment.app.Fragment
import com.example.meausrepro_android.R
import com.example.meausrepro_android.databinding.ActivityMainMeausreProBinding
import com.example.meausrepro_app.fragment.HomeFragment
import com.example.meausrepro_app.fragment.QRFragment

class MainActivity_MeausrePro : AppCompatActivity() {
    lateinit var binding:ActivityMainMeausreProBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityMainMeausreProBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 받은 아이디
        val id = intent.getStringExtra("id")

        // 기본 프래그먼트 설정
        loadFragment(HomeFragment(), id)

        // BottomNavigationView 설정
        binding.nav.setOnNavigationItemSelectedListener { menu ->
            when (menu.itemId) {
                R.id.fragmnet_home -> loadFragment(HomeFragment(), id)
                R.id.fragment_qr -> loadFragment(QRFragment(), id)
                else -> false
            }
        }
    }
    private fun loadFragment(fragment: Fragment, id: String?): Boolean {
        val bundle = Bundle()
        bundle.putString("id", id)
        fragment.arguments = bundle

        supportFragmentManager.beginTransaction().apply {
            replace(R.id.mainContainer, fragment)
            commit()
        }
        return true
    }
}