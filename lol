<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Medieval Clicker</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <link rel="stylesheet" href="styles.css">
    <style>
        body {
            font-family: 'MedievalFont', serif;
            background-color: #251c12;
            color: #f7dfc4;
            margin: 0;
            padding: 0;
        }

        .container {
            background-color: rgba(0, 0, 0, 0.6);
            border: 5px solid #8A5C2E;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
            margin-top: 50px;
        }

        .nav-pills .nav-link {
            font-size: 18px;
            padding: 10px 10px;
            background-color: rgba(112, 67, 38, 0.8);
            border-radius: 10px;
            border: none;
            color: #FFD700;
            margin: 5px;
        }

        .nav-pills .nav-link.active {
            background-color: rgba(75, 37, 19, 0.8);
            color: #8A5C2E;
            font-weight: bold;
        }

        .upgrade {
            font-size: 18px;
            color: #f7dfc4;
            background-color: #8a5c2e;
            border: 2px solid #5a3921;
            padding: 15px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: background-color 0.3s, color 0.3s;
            border-radius: 10px;
        }

        .upgrade:hover {
            background-color: #5a3921;
            color: #ffcc00;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background-color: #251c12;
            color: #f7dfc4;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        .close {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 24px;
            color: #f7dfc4;
            cursor: pointer;
        }

        .castle-image {
            border: 5px solid #532c08;
            border-radius: 10px;
            max-width: 100%;
            height: auto;
        }

        @font-face {
            font-family: 'MedievalFont';
            src: url('your-medieval-font.woff') format('woff');
        }
    </style>
    <meta name="google-adsense-account" content="your-google-adsense-account">
    <script async
        src="https://pagead2.googlesyndication.com/pagead/js?client=your-google-adsense-account" crossorigin="anonymous">
    </script>

    <!-- AdMob configuration -->
    <script>
        document.addEventListener('deviceready', function () {
            var admobid = {
                banner: 'ca-app-pub-5816082932921993/7064429773',
            };

            // Show AdMob Banner Ad
            AdMob.createBanner({
                adId: admobid.banner,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                autoShow: true,
            });
        });
    </script>
</head>

<body>
    <div class="container">
        <div class="tab-content">
            <!-- Castle Tab -->
            <div class="tab-pane fade show active" id="castle-tab">
                <div class="text-center">
                    <img id="castle"
                        src="https://raw.githubusercontent.com/largefort/Medievalskilling/main/castle.png"
                        alt="Castle" class="castle-image" onclick="clickCastle()">
                    <div id="counter" class="mt-3">
                        Gold coins: 0
                    </div>
                    <div id="owned-upgrades" class="mt-3">
                        <div>Knight: <span id="knight-count">0</span></div>
                        <div>Archer: <span id="archer-count">0</span></div>
                        <div>Wizard: <span id="wizard-count">0</span></div>
                        <div>Paladin: <span id="paladin-count">0</span></div>
                    </div>
                </div>
            </div>

            <!-- Skilling Tab -->
            <div class="tab-pane fade" id="skilling-tab">
                <div class="text-center">
                    <h2>Skilling</h2>
                    <div class="upgrade" onclick="handleSkillingClick('woodcutting')">Woodcutting</div>
                    <div class="upgrade" onclick="handleSkillingClick('mining')">Mining</div>
                    <div class="mt-3">
                        <div>Woodcutting Level: <span id="woodcutting-level">1</span></div>
                        <div>Mining Level: <span id="mining-level">1</span></div>
                    </div>
                </div>
            </div>

            <!-- Shop Tab -->
            <div class="tab-pane fade" id="shop-tab">
                <div class="text-center">
                    <h2>Shop</h2>
                    <div class="upgrade" onclick="buyUpgrade('knight')">Knight (<span id="knight-cost">10</span>
                        coins)</div>
                    <audio id="knight-upgrade-sound">
                        <source src="upgradesound.mp3" type="audio/mp3">
                        Your browser does not support the audio element.
                    </audio>
                    <div class="upgrade" onclick="buyUpgrade('archer')">Archer (<span id="archer-cost">25</span>
                        coins)</div>
                    <audio id="archer-upgrade-sound">
                        <source src="upgradesound.mp3" type="audio/mp3">
                        Your browser does not support the audio element.
                    </audio>
                    <div class="upgrade" onclick="buyUpgrade('wizard')">Wizard (<span id="wizard-cost">50</span>
                        coins)</div>
                    <audio id="wizard-upgrade-sound">
                        <source src="upgradesound.mp3" type="audio/mp3">
                        Your browser does not support the audio element.
                    </audio>
                    <div class="upgrade" onclick="buyUpgrade('paladin')">Paladin (<span id="paladin-cost">100</span>
                        coins)</div>
                    <audio id="paladin-upgrade-sound">
                        <source src="upgradesound.mp3" type="audio/mp3">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>

            <!-- Settings Tab -->
            <div class="tab-pane fade" id="settings-tab">
                <div class="text-center">
                    <h2>Settings</h2>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="checkbox" id="toggle-music"> Toggle Music
                        </label>
                    </div>
                    <div class="form-check">
                        <label class="form-check-label">
                            <input type="checkbox" id="toggle-sfx"> Toggle Sound Effects
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <div class="nav nav-pills nav-fill fixed-bottom">
            <a class="nav-link active" data-toggle="pill" href="#castle-tab">Castle</a>
            <a class="nav-link" data-toggle="pill" href="#skilling-tab">Skilling</a>
            <a class="nav-link" data-toggle="pill" href="#shop-tab">Shop</a>
            <a class="nav-link" data-toggle="pill" href="#settings-tab">Settings</a>
        </div>
    </div>

    <!-- Fullscreen Button -->
    <button id="fullscreen-button" style="display: none;" onclick="autoEnterFullscreen()">Enter Fullscreen</button>

    <!-- Scripts and Audio -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="script.js"></script>
    <audio id="medievaltheme" loop autoplay>
        <source src="medievaltheme.mp3" type="audio/mp3">
        Your browser does not support the audio element.
    </audio>
    <audio id="click-sound" src="click-sound.mp3" type="audio/mp3"></audio>

    <!-- Add your AdMob script here -->
    <script type="text/javascript" src="https://cdn.rawgit.com/appfeel/admob-google-cordova/master/www/admob.js"></script>
</body>

</html>
