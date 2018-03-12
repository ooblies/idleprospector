var idleApp = angular.module('idleApp', ['ngMaterial']);

idleApp.controller('IdleAppController', function IdleAppController($scope, $timeout, $interval, $mdToast, $mdDialog, $http, $mdSidenav) {
    $scope.data = {};  
    $scope.data.tickRate = 1000;
    $scope.data.timerMode = 'determinate';

    $scope.openMine = function openMine() {
        $scope.data.unlocks.mine = true;
        $scope.data.player.money -= 100;
    }

    $scope.toggleNav = function toggleNav(side, position) {
        if (position == 'open') {
            $mdSidenav(side).open();
        } else {
            $mdSidenav(side).close();
        }
    }

    $scope.buyableItems = function buyableItems() {
        return $scope.data.itemList.filter(i => !i.locked && (i.limit == null || i.level < i.limit));
    }

    $scope.ownedItems = function ownedItems() {
        return $scope.data.itemList.filter(i => i.level > 0);
    }

    $scope.getLevel = function getLevel(item) {
        return $scope.data.itemList.filter(i => i.id == item)[0].level;
    }

    $scope.logEvent = function logEvent(text, save) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(text)
                .position("right")
                .hideDelay(2000)
        );

        if (save) {
            $scope.data.log.push(text);
        }
        
    }

    $scope.saveGame = function saveGame() {
        localStorage.setItem('idleProspectSave',JSON.stringify($scope.data));       
        
        $scope.logEvent("Game Saved!", false);
    }

    $scope.updateSave = function updateSave(newSave) {
        //There's gotta be a better way to do this
        for (var key in newSave) {
            if ($scope.data[key] == undefined) {
                $scope.data[key] = newSave[key];
            } else {
                for (var key2 in newSave[key]) {
                    if ($scope.data[key][key2] == undefined) {
                        $scope.data[key][key2] = newSave[key][key2];
                    } else {
                        for (var key3 in newSave[key][key2]) {
                            if ($scope.data[key][key2][key3] == undefined) {
                                $scope.data[key][key2][key3] = newSave[key][key2][key3];
                            } else {
                                for (var key4 in newSave[key][key2][key3]) {
                                    if ($scope.data[key][key2][key3][key4] == undefined) {
                                        $scope.data[key][key2][key3][key4] = newSave[key][key2][key3][key4];
                                    } else {
                                        for (var key5 in newSave[key][key2][key3][key4]) {
                                            if ($scope.data[key][key2][key3][key4][key5] == undefined) {
                                                $scope.data[key][key2][key3][key4][key5] = newSave[key][key2][key3][key4][key5];
                                            }
                                        }            
                                    } 
                                }            
                            } 
                        }            
                    }  
                }            
            }            
        }
    }

    $scope.loadGame = function loadGame() {
        var newData = $scope.CreateNewPlayer('Smith');
        if(localStorage.getItem('idleProspectSave')) {
            $scope.data = JSON.parse(localStorage.getItem('idleProspectSave'));
            $scope.logEvent("Game Loaded!", false);
            $scope.mergeLists();
            $scope.updateSave(newData)
        } else {
            $scope.data = newData;
        }


        if ($scope.data.currentActionProgress != 100) {
            var hours = ($scope.data.currentActionLength * Math.round($scope.data.currentActionProgress)/100);
            $timeout($scope.passTime, $scope.data.tickRate, true, hours);
        }
    }

    $scope.mergeLists = function mergeLists() {
        itemList.forEach(element => {
            var item = $scope.data.itemList.filter(i => i.id == element.id);

            if (item.length == 0) {

            } else {
                element.level = item[0].level;
                element.locked = item[0].locked;
            }
            
        });

        $scope.data.itemList = itemList;
    }

    $scope.deleteSave = function deleteSave() {
        localStorage.clear();
        location.reload();
    }

    $scope.CreateNewPlayer = function CreateNewPlayer(oldLast) {
        var saveData = {};

        saveData.tickRate = 1000;
        saveData.timerMode = 'determinate';

        saveData.unlocks = {};
        saveData.unlocks.home = true;
        saveData.unlocks.town = true;

        saveData.version = 0.1;
        saveData.itemList = itemList;

        saveData.player = {}; 

        saveData.player.stats = {};
        saveData.player.stats.health = 100;
        saveData.player.stats.minimumPanning = 0;
        saveData.player.stats.maximumPanning = .01;
        saveData.player.stats.sleepHealthGain = 3;
        saveData.player.stats.panHealthCost = 2;

        saveData.player.employees = {};
        saveData.player.employees.miner = 0;
        saveData.player.employees.courier = 0;
        saveData.player.employees.caravan = 0;

        saveData.player.years = 18;
        saveData.player.months = 0;
        saveData.player.days = 0;
        saveData.player.hours = 0;
        saveData.player.generation = 0;        

        saveData.player.money = 0;
        saveData.player.gold = 0;

        saveData.mineGold = 0;        
        saveData.courierGold = 0;

        saveData.items = {};
        saveData.items.ration = 5;
   
        saveData.currentAction = '';
        saveData.currentActionLength = 0;
        saveData.currentActionProgress = 100;
        saveData.currentTravelDestination = 'home';
        
        saveData.timerMode = 'determinate';

        saveData.paused = true;

        $http.get('/txt/firstnames.txt').then(function(data) {
            var lines = data.data.split('\n');
            var randLineNum = Math.floor(Math.random() * lines.length);
            var name = lines[randLineNum].toLowerCase();
            saveData.player.firstName = name.charAt(0).toUpperCase() + name.slice(1);
            if (randLineNum < lines.length/2) {
                saveData.player.gender = 'male';
                saveData.player.lastName = oldLast;
            } else  {
                saveData.player.gender = 'female';

                $http.get('/txt/lastnames.txt').then(function(data) {
                    var lines = data.data.split('\n');
                    var randLineNum = Math.floor(Math.random() * lines.length);
                    var name = lines[randLineNum].toLowerCase();
                    saveData.player.lastName = name.charAt(0).toUpperCase() + name.slice(1);
                }, function (error) {
                    saveData.player.lastName = "Doe";
                });
            } 
        }, function (error) {
            saveData.player.firstName = "John";
            saveData.player.lastName = oldLast;
            saveData.player.gender = "male";
        });

        
        return saveData;
    }


    $scope.getAvgGoldPerPan = function getAvgGoldPerPan() {    
        var min = $scope.data.player.stats.minimumPanning + $scope.getBonusFromItems('minimumPanning');
        var max = $scope.data.player.stats.maximumPanning + $scope.getBonusFromItems('maximumPanning');

        return (min+max)/2;
    }

    $scope.increaseLevel = function increaseLevel(itemId, count) {
        $scope.data.itemList.filter(i => i.id == itemId)[0].level += count;
    }

    $scope.decreaseLevel = function decreaseLevel(itemId, count) {
        $scope.data.itemList.filter(i => i.id == itemId)[0].level -= count;
    }

    $scope.buy = function buy(itemId) {
        var unlocks = [];
        var itemName = "";

        $scope.data.itemList.forEach(element => {
            if (element.id == itemId) {
                itemName = element.name;
                $scope.data.player.money -= (element.level*element.level*element.baseCost + element.baseCost);                    
                element.level++;

                unlocks = element.unlocks;
            }
        });       

        //Unlock Items
        $scope.data.itemList.forEach(element => {
            if (unlocks.includes(element.id)) {
                element.locked = false;
            }
        });
    }

    $scope.hire = function hire(employee) {
        switch(employee) {
            case 'miner':                                   
                $scope.data.player.employees.miner++;
                $scope.data.unlocks.caravan = true;
                $scope.data.timerMode = 'indeterminate';
                break;
            case 'courier' :
                $scope.data.player.employees.courier++;
                $scope.data.unlocks.courier = true;
                $scope.data.timerMode = 'indeterminate';
                break;
            case 'caravan':
                $scope.data.player.employees.caravan++;
                $scope.data.unlocks.foreman = true;
                break;
            default:
                //nope
        }
    }

    $scope.sellGold = function sellGold(amount) {
        $scope.data.player.gold -= amount;
        $scope.data.player.money += amount*20; //1850 prices -> $20/oz
        $scope.data.unlocks.store = true;
        if ($scope.data.player.money >= 10) {
            $scope.data.unlocks.blacksmith = true;
        }
    }

    $scope.getBonusFromItems = function getBonusFromItems(type) {
        var bonus = 0;       
        
        $scope.data.itemList.filter(i => i.level > 0).forEach(element => {
            bonus += (angular.equals(element.bonus, {}) ? 0 : (element.bonus[type] ? (element.bonus[type] * element.level) : 0));
        });
        
        return bonus;
    }

    $scope.panForGold = function panForGold() {
        var min = $scope.data.player.stats.minimumPanning + $scope.getBonusFromItems('minimumPanning');
        var max = $scope.data.player.stats.maximumPanning + $scope.getBonusFromItems('maximumPanning');
        if (min > max) {
            max = min;
        }

        $scope.data.player.gold += $scope.getRandomInteger(min, max);
    }

    $scope.collectGoldFromMine = function collectGoldFromMine() {
        $scope.data.player.gold += $scope.data.mineGold;
        $scope.data.mineGold = 0;
    }
   
    $scope.getRandomInteger = function getRandomInteger(min, max) {
        return Math.random() * (max - min) + min;
    }

    $scope.passTimeIndeterminately = function passTimeIndeterminately() {
        if ($scope.data.timerMode == 'indeterminate') {
            var moneyCost = 0;
            var goldGain = 0;

            moneyCost += $scope.data.player.employees.miner * (4/24); //$4/day
            moneyCost += $scope.data.player.employees.courier * (10/24);
            moneyCost += $scope.data.player.employees.caravan * (10/24); //$10/day

            goldGain += $scope.data.player.employees.miner * 0.01;

            $scope.data.player.hours++;
            $scope.data.mineGold += goldGain;
            $scope.data.player.money -= moneyCost;

            if ($scope.data.player.employees.courier > 0) {
                if ($scope.data.player.hours == 12) {
                    $scope.data.courierGold = $scope.data.mineGold;
                    $scope.data.mineGold = 0;
                } else if ($scope.data.player.hours == 24) {
                    $scope.data.player.money += $scope.data.courierGold * 20;
                    $scope.data.courierGold = 0;
                }
            }

            $scope.updatePlayerStats();          
            
            if ($scope.data.player.money <= moneyCost) {
                $scope.data.timerMode = 'determinate';
                $scope.data.player.employees.miner = 0;
            }
        }
    }

    $scope.die = function die() { 
        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .title("You're dead.")
            .textContent("Good news and bad news. <br/>Bad: You died. <br/>Good: Your offspring will inherit 10% of your money! So that's nice.")                    
            .ok('I guess...');

        $mdDialog.show(confirm).then(function() {
            var inheritance = $scope.data.player.money * .1;
            var generation = $scope.data.player.generation;
            var oldLastName = $scope.data.player.lastName;
            var unlocks = $scope.data.unlocks;

            $scope.data = $scope.CreateNewPlayer($scope.data.player.lastName);
            $scope.data.player.money += inheritance;
            $scope.data.player.generation = generation + 1;
            $scope.data.unlocks = unlocks;
        }, function() {
            //This shouldn't be reachable.
            alert('whoops');
        });
    }

    $scope.passTime = function passTime(hours) {
        hours--;
        $scope.data.player.hours++;
        $scope.data.currentActionProgress += (1/$scope.data.currentActionLength*100);

        switch ($scope.data.currentAction){
            case "pan":
                $scope.data.player.stats.health -= ($scope.data.player.stats.panHealthCost - $scope.getBonusFromItems('workCost'));
                $scope.panForGold();                
                break;  
            case "sleep":
                $scope.data.player.stats.health += $scope.data.player.stats.sleepHealthGain + $scope.getBonusFromItems('sleepRecovery');
                break;
            case "travel":            

                break;
            default:
                break;
        }

        $scope.updatePlayerStats();

        if ($scope.data.player.stats.health <= 0 && $scope.data.items.ration == 0) {            
            $scope.die();           
        } else {
            if ($scope.data.player.stats.health <= 0) {
                $scope.eatRation(); //ration health, Do something about this.
                
                $scope.logEvent("Health Critical. Ration Consumed.", false);
            }

            if (hours > 0) {            
                $timeout($scope.passTime, $scope.data.tickRate, true, hours);
            } else {
                $scope.data.paused = true;
            }
        }        
    };

    $scope.travel = function travel(location, hours) {
        $scope.currentTownLocation = 'Bank';

        $scope.data.paused = false;

        $scope.data.currentTravelDestination = location;
        $scope.data.currentAction = 'travel';
        $scope.data.currentActionLength = hours - $scope.getBonusFromItems('travelTime');
        $scope.data.currentActionProgress = 0;

        $timeout($scope.passTime, $scope.data.tickRate, true, hours);

        $scope.toggleNav('left','close');
    };

    $scope.pan = function pan(hours) {     
        $scope.data.paused = false;          
        
        $scope.data.currentAction = 'pan';
        $scope.data.currentActionLength = hours;
        $scope.data.currentActionProgress = 0;

        $timeout($scope.passTime, $scope.data.tickRate, true, hours);
    };

    $scope.sleep = function sleep(hours) {  
        $scope.data.paused = false;         

        $scope.data.currentAction = "sleep";
        $scope.data.currentActionLength = hours;
        $scope.data.currentActionProgress = 0;

        $timeout($scope.passTime, $scope.data.tickRate, true, hours);
    };

    $scope.buyRation = function buyRation() {
        $scope.data.items.ration++;
        $scope.data.player.money-= 1;
    }

    $scope.eatRation = function eatRation() {
        $scope.data.items.ration--;
        $scope.data.player.stats.health += 20 + $scope.getBonusFromItems('foodRecovery');

        $scope.updatePlayerStats();
    };

    $scope.updatePlayerStats = function updatePlayerStats() {
        if ($scope.data.player.hours >= 24) {
            $scope.data.player.hours -= 24;
            $scope.data.player.days++;
        }
        if ($scope.data.player.days > 31) {
            $scope.data.player.days -= 31;
            $scope.data.player.months++;
        }
        if ($scope.data.player.months > 12) {
            $scope.data.player.months -= 12;
            $scope.data.player.years++;
        }

        if ($scope.data.player.stats.health > 150) {
            $scope.data.player.stats.health = 150;
        }
    }

    

    $scope.loadGame();

    $interval($scope.saveGame, 60000);
    $interval($scope.passTimeIndeterminately, $scope.data.tickRate);
    
});