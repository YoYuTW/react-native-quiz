# 上架流程 - Android/ Apple

以下將敘述兩個作業系統的上架流程，以及一些需注意事項。

<hr>

## Android
<font color="eed202">由於上架到 Google Play 為大宗，以下將主要對 Google Play 做說明</font>

上架至 Play 商店的應用程式以及所有更新都需要有數位簽章，簽章則是以一組 upload key 進行。可參考[官方說明文件](https://developer.android.com/studio/publish/app-signing)確認簽名的詳細流程。

## 流程

<br>

### 1. 生成上傳密鑰

  可透過 ``keytool`` 指令生成該密鑰，<font color="#df4759">並確保密鑰沒有外流或遺失</font>。
    
  __Windows 使用者__ 必須在路徑

  ``C:\Program Files\Java\jdkx.x.x_x\bin`` 
    
  執行下列指令：

  ``keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000``    

  __Mac 使用者__ 移到 JDK 資料夾後，輸入下列指令生成密鑰：

  ``sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000``
    
  一些參數說明：
  - \-keystore：指定密鑰庫的名稱（檔案名稱為``my-upload-key.keystore``）
  - \-alias：密鑰的別名，用來簽章應用程式
  - \-keyalg：密鑰的演算法
  - \-keysize：密鑰的長度
  - \-validity：密鑰的效期（天）

### 2. 設定 Gradle 變數
  1. 將密鑰檔案放到專案的 `android/app` 資料夾當中
  2. 在 `~/.gradle/gradle.properties` 或 `android/gradle.properties` 中新增下列變數：

      `MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore`

      `MYAPP_UPLOAD_KEY_ALIAS=my-key-alias`

      `MYAPP_UPLOAD_STORE_PASSWORD=*****`

      `MYAPP_UPLOAD_KEY_PASSWORD=*****`

      <font color="#eed202">＊當使用 git 時避免使用 `android/gradle.properties`，若沒有 `~/.gradle/gradle.properties` 則手動建立該檔案後再將變數新增在內。

      ＊MacOS 使用者也可以考慮儲存憑證在鑰匙圈內，則後兩行關於密碼的變數則可忽略。</font>

### 3. 添加簽名到 Gradle 當中
  在專案資料夾中的 `android/app/build.gradle` 新增簽名的設置：

    ...
    android {
        ...
        defaultConfig { ... }
        signingConfigs {
            release {
                if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                    storeFile file(MYAPP_UPLOAD_STORE_FILE)
                    storePassword MYAPP_UPLOAD_STORE_PASSWORD
                    keyAlias MYAPP_UPLOAD_KEY_ALIAS
                    keyPassword MYAPP_UPLOAD_KEY_PASSWORD
                }
            }
        }
        buildTypes {
            release {
                ...
                signingConfig signingConfigs.release
            }
        }
    }
    ...

### 4. 生成 Android App Bundle (AAB)
  在終端機執行

  `cd android`

  `./gradlew bundleRelease`

  就會生成 Android 打包檔，並可以在 `android/app/build.gradle` 查看如何改變預設打包的設定。

  <font color="#eed202">＊請確保 `gradle.properties` 不包含 `org.gradle.configureondemand=true` 否則打包時會跳過 JS 檔和一些附件。</font>
  
  生成的打包檔即可上傳至 Google Play，檔案放在 `android/app/build/outputs/bundle/release/app-release.aab`。

  如前面提到，Google Play 上架前須經過數位簽名，你可以在 Google Play Console 執行這件事。

### 5. 上架前測試
  <font color="#df4759">上架前請完整測試整份應用程式</font>

  測試前請先確保已經完整刪除之前版本的應用程式，之後在專案資料夾下執行下列指令：

  `npx react-native run-android --variant=release`

  <font color="#eed202">＊ `--variant` 只有在完成前述步驟後才能只用。</font>

### - 上架到其他商店
  預設生成的 apk 檔會有 x86 和 ARMv7a 兩種版本，好處是讓絕大部分 Android 都能執行，相對的就會讓檔案較大。

  有些商店（如 Google Play 和 Amazon AppStore）你可以上傳兩個版本的應用程式檔案，商店會偵測使用者環境，下載對應的 apk 檔。

  修改 `android/app/build.gradle` 可對 CPU 生成個別的 APK 檔：

    - ndk {
    -   abiFilters "armeabi-v7a", "x86"
    - }
    - def enableSeparateBuildPerCPUArchitecture = false
    + def enableSeparateBuildPerCPUArchitecture = true
  
  若是不支援辨識使用者環境的商店（如 APKFiles），則修改同檔案中的 `universalApk false` 成 `universalApk true` 則可生成包含兩個版本的 apk 檔。

<hr>

## Apple

Apple 上架需使用開發者帳號，年費 99 USD。

## 流程

### 1.在 App Store Connect 建立 App
  上傳前須先連結到 [App Store Connect](https://appstoreconnect.apple.com/login)，登入後依序點選

  `我的 App -> 建立 App -> 依序輸入 App 的基本資訊`

  建立完成基本資訊後，會在 [Certificates, Identifiers & Profiles](https://developer.apple.com/account) 生成 App ID，接著在 **App 資訊**設定其他資訊：

  - 副標題
  - 隱私權政策 URL
  - 類別

在**訂價與供應狀況**設定供貨相關資訊：
  - 價格
  - 預購開啟
  - 上架的國家
  - 大量採購寄貨

切換到**準備提交**，可設定上架前準備的資訊：
  - 預覽圖（需準備 5.5 和 6.5 吋的版本，JPG 或 PNG，上限為 10 張）
  - 行銷宣傳文字和描述
  - App 關鍵字
  - 支援和行銷 URL
  - App 版本
  - App 分級
  - 版權
  - 登入資訊
  - 聯絡資訊
  - 備註和附件
  - App 支援語言

### 2. 從 Xcode 上傳 App
  切換到 App 的 **General** 頁面，在 *Signing* 中點選 *Add Account*，登入上架帳號後，在 *Team* 欄位當中選擇剛剛新增的帳號。

  此時 Xcode 會協助建立 App 的 Provisioning Profile，並可在 [Certificates, Identifiers & Profiles](https://developer.apple.com/account) 確認帳號的 Development certificate。

  接著設定專案：

  1. 檢查 App 的 Bundle identifier 和 Version 是否與 App Store Connect 一致
  2. 檢查 `Assets.xcassets` 裡是否已設定 App Icon 60pt 和 1024pt 的圖片
  3. 將 App Build 的對象改為 Generic iOS Device

  設定完畢後，可開始上傳 App：
  
  1. 點擊 Product > Archive，包裝製作 App
  2. 點擊 Distribute App
  3. 選擇 iOS App Store
  4. 選擇 upload
  5. 產生 iOS Distribution certificate
  6. 點擊 Upload 上傳

  若上傳成功，即會回傳 successfully uploaded。

### 3. 送審 App
  回到 App Store Connect，進行下列步驟：
  
  1. 切換到活動分頁，會看到剛剛上傳的 App 狀態為處理中，等 App 結束處理後會寄信通知處理的結果
  2. 處理成功後，選擇欲送審的 App 版本
  3. 接著填寫下列資訊：

      - 出口合規資訊
      - 內容版權
      - 廣告識別碼

  完成後 App 的狀態會變成 *正在等待審查*

