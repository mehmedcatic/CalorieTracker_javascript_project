
const successMsg = "success";
const failedMsg = "failed";

//Local Storage controller
const StorageController = (function () {

    return {

        // Meals || Items part of the storage fctions

        //Add new item to ls
        storeItem: function (item) {
            let items;
            //Check for items in ls
            if (localStorage.getItem("items") === null) {
                items = [];
                items.push(item);

                localStorage.setItem("items", JSON.stringify(items));
            }
            else {
                items = JSON.parse(localStorage.getItem("items"));

                items.push(item);

                localStorage.setItem("items", JSON.stringify(items));
            }
        },

        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem("items") === null) {
                items = [];
            }
            else {
                items = JSON.parse(localStorage.getItem("items"));
            }
            return items;
        },

        deleteItemFromStorage: function (itemId) {
            //Instead of removing items from storage, we'll set the removed att to true
            let items = this.getItemsFromStorage();
            items = Array.from(items);
            let index = null;
            items.forEach(function (itemArr, arrayIndex) {
                if (itemArr.id === itemId) {
                    itemArr.removed = true;
                }
            });

            localStorage.setItem("items", JSON.stringify(items));
        },

        updateItemInStorage: function (item) {
            let items = this.getItemsFromStorage();
            if (items != []) {
                items = Array.from(items);
                items.forEach(function (x, index) {
                    if (item.id === x.id) {
                        x.name = item.name;
                        x.calories = item.calories;
                    }
                });
            }
            localStorage.setItem("items", JSON.stringify(items));
        },


        // Days part of the storage fctions

        //Add new day to ls
        storeNewDay: function (day) {
            let days;
            //Check for items in ls
            if (localStorage.getItem("days") === null) {
                days = [];
                days.push(day);

                localStorage.setItem("days", JSON.stringify(days));
            }
            else {
                days = JSON.parse(localStorage.getItem("days"));

                days.push(day);

                localStorage.setItem("days", JSON.stringify(days));
            }
        },

        getDaysFromStorage: function () {
            let days;
            if (localStorage.getItem("days") === null) {
                days = [];
            }
            else {
                days = JSON.parse(localStorage.getItem("days"));
            }
            return days;
        },

        deleteDayFromStorage: function (day) {
            let days = this.getDaysFromStorage();
            days = Array.from(days);
            let index = -1;
            days.forEach(function (daysArr, arrayIndex) {
                if (daysArr.id == day) {
                    index = arrayIndex;
                }
            });
            if (index >= 0) {
                days.splice(index, 1);
            }

            localStorage.setItem("days", JSON.stringify(days));
        },


        //The idea of this fction is to add a dataMealArray to ls which will store data in this format:
        // [
        //  {day.id, [array of mealID-s added to this particular day]},
        // ]

        storeMealToDay: function (obj) {
            let dataDaysMealsArray;
            //Check for items in ls
            if (localStorage.getItem("daysMealsArray") === null) {
                dataDaysMealsArray = [];
                dataDaysMealsArray.push(obj);

                localStorage.setItem("daysMealsArray", JSON.stringify(dataDaysMealsArray));
            }
            else {
                //If the daysMealsArray already exists in ls, we need to check for the existing day x.day == obj.day
                // and then append the mealId to the array of meals
                // Also, if the day doesnt exist in the ls we need to push it to the daysMealsArray for which we use the 
                // boolean var to verify

                dataDaysMealsArray = JSON.parse(localStorage.getItem("daysMealsArray"));
                let pushed = false;

                dataDaysMealsArray.forEach(function (x, index) {
                    if (x.day == obj.day) {
                        x.mealsId.push(obj.mealsId);
                        pushed = true;
                    }

                });

                if (!pushed)
                    dataDaysMealsArray.push(obj);

                localStorage.setItem("daysMealsArray", JSON.stringify(dataDaysMealsArray));
            }
        },

        getMealsDaysArray: function () {
            let dataDaysMealsArray;
            if (localStorage.getItem("daysMealsArray") === null) {
                dataDaysMealsArray = [];
            }
            else {
                dataDaysMealsArray = JSON.parse(localStorage.getItem("daysMealsArray"));
            }
            return dataDaysMealsArray;
        },

        deleteDayMealObject: function (dayId) {
            //Delete entire object [{ day, mealsId:[] }]
            let objToDelete = this.getMealsDaysArray();
            let indx = -1;
            objToDelete.forEach(function (x, index) {
                if (x.day == dayId) {
                    indx = index;
                }
            });
            if (indx >= 0) {
                objToDelete.splice(indx, 1);
            }

            localStorage.setItem("daysMealsArray", JSON.stringify(objToDelete));
        },

        deleteMealFromDayMealArr: function (dayId, itemId) {
            //Delete only meal from MealsId array
            let objToDelete = this.getMealsDaysArray();
            let indx = -1;
            objToDelete.forEach(function (x) {
                if (x.day == dayId) {
                    x.mealsId.forEach(function (y, index) {
                        if (y == itemId) {
                            indx = index;
                        }
                    });
                }
                if (indx >= 0) {
                    x.mealsId.splice(indx, 1);
                    indx = -1;
                }
            });
            localStorage.setItem("daysMealsArray", JSON.stringify(objToDelete));
        }
    }
})();


//Days controller
const DaysController = (function () {

    //Days ctor
    const Days = function (id, mealId) {
        this.id = id;
    }

    //Data str of days with meals
    const data = {
        daysArr: StorageController.getMealsDaysArray(),
        days: StorageController.getDaysFromStorage()
    }

    //Adding a +1 since we want the days to start from 1 and go ++
    const generateNewId = function () {
        let idOfTheLastAdded = -1;
        let days = StorageController.getDaysFromStorage();
        if (days.length === 0) {
            idOfTheLastAdded = 0;
        } else {
            for (let index = 0; index < days.length + 1; index++) {
                if (index === days.length - 1) {
                    idOfTheLastAdded = days[index].id;
                }
            }
        }
        return idOfTheLastAdded + 1;
    }

    return {

        logData: function () {
            return data;
        },

        getDataArr: function () {
            return data.daysArr;
        },

        getDays: function () {
            return data.days;
        },

        addNewDay: function () {
            let dayId = generateNewId();
            let day = new Days(dayId);
            //Push the obj with the dayId and empty [] of mealsIds to daysMealArr when we add a new day 
            data.daysArr.push({ day: day.id, mealsId: [] });
            //Push the new day to the data
            data.days.push(day);

            //Store in local storage
            StorageController.storeNewDay(day);
            StorageController.storeMealToDay({ day: day.id, mealsId: [] });
            return day;
        },

        addMealToDay: function (mealId, dayId) {
            data.daysArr.forEach(function (x) {
                //Adding a new meal to the specific day
                if (x.day == dayId) {
                    x.mealsId.push(mealId);
                }
            });
            //Push the mealId to storage
            StorageController.storeMealToDay({ day: dayId, mealsId: mealId });
        }
    }
})();

//Users controller
const UsersController = (function () {

    //Users constructor
    const User = function (id, name, lastName, dateOfBirth, age, height, weight, sex) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.dateOfBirth = dateOfBirth;
        this.age = age;
        this.height = height;
        this.weight = weight;
        this.sex = sex;
    }

    //Users data structure
    const data = {
        //User data will be preset to these values in the application
        users: [
            { id: 0, name: "Mehmed", lastName: "Catic", dateOfBirth: "14.02.1998", age: 22, height: 190, weight: 90, sex: "M" }
        ],
        currentUser: null
    };


    return {
        getUsers: function () {
            return data.users;
        },

        logData: function () {
            return data;
        }

    }
})();

//Items controller
const ItemController = (function () {

    //Item constructor
    const Item = function (id, name, calories, type, removed = false) {
        this.id = id;
        this.name = name;
        this.calories = calories;
        this.type = type;
        this.removed = removed;
    }

    const ItemType = function (id, name) {
        this.id = id;
        this.name = name;
    }


    //Meal data structure
    const data = {
        items: StorageController.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0,
        itemTypes: [
            { id: 0, name: "Breakfast" },
            { id: 1, name: "Lunch" },
            { id: 2, name: "Dinner" },
            { id: 3, name: "Snack" }
        ]
    }


    return {

        logData: function () {
            return data;
        },

        getItems: function () {
            return data.items;
        },

        getItemForEdit: function (itemId) {
            let item = null;
            data.items.forEach(function (x) {
                if (x.id === itemId) {
                    item = x;
                }
            });
            return item;
        },

        getCurrentItem: function () {
            return data.currentItem;
        },

        setCurrentItem: function (item) {
            data.currentItem = item;
        },

        addItem: function (name, calories, dayId) {
            let ID;

            if (this.getCurrentItem() == null) {
                //if current item is null that means that no item was deleted before adding new item
                if (data.items.length > 0) {
                    //so we set the id to the next id in the arr of items if there are any
                    ID = data.items[data.items.length - 1].id + 1;
                } else {
                    //if items arr empty, set the id to 0
                    ID = 0;
                }
            } else {
                //current item != null, means an item was deleted/updated
                if (data.items.length > 0) {
                    //the meals arr contains items and we check if the deleted item (currentItem) has the highest id
                    if ((data.items.length - 1) > (this.getCurrentItem().id)) {
                        //if not
                        ID = data.items[data.items.length - 1].id + 1;
                    }
                    else {
                        //if the deleted item was the last one added grab his id and set the new id to +1
                        ID = this.getCurrentItem().id + 1;
                        this.setCurrentItem(null);
                    }
                }
            }
            //Calories input to number
            calories = parseInt(calories);

            //create new obj
            objToAdd = new Item(ID, name, calories);

            //push it to the items arr
            data.items.push(objToAdd);

            return objToAdd;
        },

        updateItem: function (dayId) {
            //find the item in mealsArr and update it's values
            data.items.forEach(function (x) {
                if (x.id === data.currentItem.id) {
                    x.name = document.querySelector(`#item-name-${dayId}`).value;
                    x.calories = parseInt(document.querySelector(`#item-calories-${dayId}`).value);
                }
            });


        },

        //Set the removed att to true
        deleteItem: function (itemId) {
            data.items.forEach(function (x) {
                if (x.id == itemId) {
                    x.removed = true;
                }
            });
        },

        //sum all cals of existing items
        getCalories: function () {
            let cals = 0;
            data.items.forEach(function (x) {
                cals += x.calories;
            });

            data.totalCalories = cals;

            return data.totalCalories;
        }
    }
})();


//UI controller
const UIController = (function () {

    return {
        //Populate with values set in the UserController 
        populateUserInfoDiv: function (user) {
            let html = `
            <span class="card-title" style="color:#ffab40; font-weight:bold; margin-bottom:1.5rem;">USER INFO</span>
            <div class="row">
                <form class="col s12">
              
                    <div class="row">
                        <div class="input-field col s6">
                            <input disabled value="${user[0].name} ${user[0].lastName}" id="name" type="text" class="validate white-text">
                            <label for="name"><b>NAME:</b>
                            </label>
                        </div>

                        <div class="input-field col s6">
                            <input disabled value="${user[0].sex}" id="sex" type="text" class="validate white-text">
                            <label for="sex"><b>GENDER:</b>
                            </label>
                        </div>
                    </div>
                    
                    <div class="row">
                    
                        <div class="input-field col s6">
                        <input disabled value="${user[0].dateOfBirth}" id="dateOfBirth" type="text" class="validate white-text">
                         <label for="dateOfBirth"><b>DATE OF BIRTH:</b>
                        </label>
                        </div>
                        <div class="input-field col s6">
                            <input disabled value="${user[0].age}" id="age" type="text" class="validate white-text">
                            <label for="age"><b>AGE:</b>
                            </label>
                        </div>
                    </div>

                    <div class="row">
                        <div class="input-field col s6">
                            <input disabled value="${user[0].height}" id="height" type="text" class="validate white-text">
                            <label for="height"><b>HEIGHT (in cm):</b>
                            </label>
                        </div>

                        <div class="input-field col s6">
                            <input disabled value="${user[0].weight}" id="weight" type="text" class="validate white-text">
                            <label for="weight"><b>WEIGHT (in kg):</b>
                            </label>
                        </div>
                    </div>
              
                 </form>
             </div>
            `;

            document.getElementById("user-info").innerHTML = html;
        },

        populateItemList: function (items, dayId) {
            //In LS we have three arrs stored: Items(every added item is stored there), Days, daysMealsArr
            //We need to loop through daysMealsArr and get the meals from every added day in particular and then 
            //add them to UI             

            let html = "";
            let dataArr = DaysController.getDataArr();
            dataArr.forEach(function (x) {
                if (x.day == dayId) {
                    items.forEach(function (item) {
                        // if (item.removed != true) 
                        // {
                        x.mealsId.forEach(function (y) {
                            if (y == item.id) {
                                html += `
                                    <li class="collection-item" id="item-${item.id}">
                                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                                        <a href="#" class="secondary-content">
                                            <i class="edit-item fa fa-pencil"></i>
                                        </a>
                                    </li>
                                    `;
                            }
                        });
                        // }

                    });
                }
            });

            //Add a button to the end of every list with items
            html += `
                <button class="btn blue darken-3 addNewMealBtn pull-right" style="display:block; margin-top: 1rem;">ADD NEW MEAL</button>
                `;


            let ulId = `item-list-${dayId}`;
            document.getElementById(ulId).innerHTML = html;

        },

        //Fction used to show recently added item on UI
        addListItem: function (item) {
            document.getElementById("item-list").style.display = "block";

            let li = document.createElement("li");
            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;

            document.getElementById("item-list").insertAdjacentElement("beforeend", li);
        },

        //Delete from UI
        deleteItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        //Edit on UI
        editListItem: function (item, dayId) {
            let listId = "item-" + item.id;
            let name = document.querySelector(`#item-name-${dayId}`).value;
            let cals = document.querySelector(`#item-calories-${dayId}`).value;
            document.querySelector(`#${listId}`).innerHTML = `<strong>${name}: </strong> <em>${cals} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;

        },


        showTotalCals: function (cals, dayId) {
            document.getElementById(`total-calories-${dayId}`).textContent = cals;
        },


        addNewDay: function (day) {
            let li = document.createElement("li");
            li.className = "collection-item item-days";
            li.id = `day-${day.id}`;
            li.innerHTML = `
                <div>DAY ${day.id}<a href="#!" class="secondary-content"><i class="material-icons expandMore">expand_more</i></a></div>
                
                <div class="card"  id="card-${day.id}" style="display:none;">
    
                <h6 class="center-align">CALORIES: <span id="total-calories-${day.id}">0</span></h6>

                
                <ul class="collection" id="item-list-${day.id}">
                   
                    
                 </ul>  


                <div class="card-content" style="display:none;">
                    <span class="card-title">Add Meal / Food Item</span>
                    <form class="col">
                        <div class="row">
                            
                            <div class="input-field col s6">
                                <input type="text" placeholder="Add Item" id="item-name-${day.id}">
                            </div>
                            <div class="input-field col s6">
                                <input type="number" placeholder="Add Calories" id="item-calories-${day.id}">
                            </div>
                            <button class="add-btn btn blue darken-3"><i class="fa fa-plus"></i> Add Meal</button>
                            <button class="update-btn btn orange"><i class="fa fa-pencil-square-o"></i> Update Meal</button>
                            <button class="delete-btn btn red"><i class="fa fa-remove"></i> Delete Meal</button>
                            <button class="back-btn btn blue grey pull-right"><i class="fa fa-chevron-circle-left"></i> Back</button>
                        </div>
                    </form>
                </div>
            </div>
            `;

            document.querySelector("#daysList").appendChild(li);
        },


        removeDaysFromList: function () {
            document.querySelectorAll(".item-days").forEach(function (x) {
                console.log(x);
                x.remove();
            });

        },

        //This fction will be called from the main app ctrlr in the INIT fction. So, when the app loades the existing days 
        // in the ls will be shown in the UI
        populateDaysList: function () {
            this.removeDaysFromList();

            let dataArr = StorageController.getDaysFromStorage();
            let len = dataArr.length;
            dataArr.forEach(function (x, index) {
                let li = document.createElement("li");
                li.className = "collection-item item-days";
                li.id = `day-${x.id}`;

                //Added the if statement to make sure that you can only delete the last day added
                if (index === len - 1) {
                    li.innerHTML = `
                    <div>DAY ${x.id} <a href="#!" class="secondary-content"><i class="material-icons expandMore">expand_more</i></a><a href="#!" class="secondary-content"><i class="material-icons deleteDay">delete</i></a></div>
                    
                    <div class="card"  id="card-${x.id}" style="display:none;">
        
                    <h6 class="center-align">CALORIES: <span id="total-calories-${x.id}">0</span></h6>

                    
                    <ul class="collection" id="item-list-${x.id}">
                    
                        
                    </ul>  


                    <div class="card-content" style="display:none;">
                        <span class="card-title">Add Meal / Food Item</span>
                        <form class="col">
                            <div class="row">
                                
                            <div class="input-field col s6">
                            <input type="text" placeholder="Name..." id="item-name-${x.id}" class="validate">
                            <span class="helper-text" data-error=" " data-success=" " style="color:transparent;" id="name-span-${x.id}">Meal name must be between 3 and 50 characters without (:,.""-)</span>
                        </div>
                        <div class="input-field col s6">
                            <input type="number" placeholder="Calories..." id="item-calories-${x.id}" class="validate">
                            <span class="helper-text" data-error=" " data-success=" " style="color:transparent;" id="calories-span-${x.id}">Meal calories input must be in a number format</span>
                        </div>
                                <button class="add-btn btn blue darken-3" id="add-btn-${x.id}"><i class="fa fa-plus"></i> Add Meal</button>
                                <button class="update-btn btn orange" id="update-btn-${x.id}"><i class="fa fa-pencil-square-o"></i> Update Meal</button>
                                <button class="delete-btn btn red" id="delete-btn-${x.id}"><i class="fa fa-remove"></i> Delete Meal</button>
                                <button class="back-btn btn blue grey pull-right" id="back-btn-${x.id}"><i class="fa fa-chevron-circle-left"></i> Back</button>
                            </div>
                        </form>
                    </div>
                </div>
                `;
                } else {
                    li.innerHTML = `
                    <div>DAY ${x.id}<a href="#!" class="secondary-content"><i class="material-icons expandMore">expand_more</i></a></div>
                    
                    <div class="card"  id="card-${x.id}" style="display:none;">
        
                    <h6 class="center-align">CALORIES: <span id="total-calories-${x.id}">0</span></h6>

                    
                    <ul class="collection" id="item-list-${x.id}">
                    
                        
                    </ul>  


                    <div class="card-content" style="display:none;">
                        <span class="card-title">Add Meal / Food Item</span>
                        <form class="col">
                            <div class="row">
                                
                            <div class="input-field col s6">
                            <input type="text" placeholder="Name..." id="item-name-${x.id}" class="validate">
                            <span class="helper-text" data-error=" " data-success=" " style="color:transparent;" id="name-span-${x.id}">Meal name must be between 3 and 30 characters</span>
                        </div>
                        <div class="input-field col s6">
                            <input type="number" placeholder="Calories..." id="item-calories-${x.id}" class="validate">
                            <span class="helper-text" data-error=" " data-success=" " style="color:transparent;" id="calories-span-${x.id}">Meal calories input must be in a number format</span>
                        </div>
                                <button class="add-btn btn blue darken-3" id="add-btn-${x.id}"><i class="fa fa-plus"></i> Add Meal</button>
                                <button class="update-btn btn orange" id="update-btn-${x.id}"><i class="fa fa-pencil-square-o"></i> Update Meal</button>
                                <button class="delete-btn btn red" id="delete-btn-${x.id}"><i class="fa fa-remove"></i> Delete Meal</button>
                                <button class="back-btn btn blue grey pull-right" id="back-btn-${x.id}"><i class="fa fa-chevron-circle-left"></i> Back</button>
                            </div>
                        </form>
                    </div>
                </div>
                `;
                }


                document.querySelector("#daysList").appendChild(li);
            });

        }
    }

})();


//Application controller
const AppController = (function (StorageController, UsersController, ItemController, UIController) {

    const loadEventListeners = function () {


        // Make the navbar transparent on scroll
        window.addEventListener('scroll', function () {
            if (window.scrollY > 60) {
                document.querySelector('nav').style.opacity = 0.85;
            } else {
                document.querySelector('nav').style.opacity = 1;
            }
        });


        //Add item event
        document.querySelector("#daysList").addEventListener("click", itemAddSubmit);

        //Edit item
        document.querySelector("#daysList").addEventListener("click", itemEditClick);

        //Submit edited item
        document.querySelector("#daysList").addEventListener("click", itemEditSubmit);

        //Back button
        document.querySelector("#daysList").addEventListener("click", backToAdd);

        //Delete item
        document.querySelector("#daysList").addEventListener("click", deleteItem);

        //Add new day
        document.querySelector("#addNewDay").addEventListener("click", addNewDay);

        //Expand day btn
        document.querySelector("#daysList").addEventListener("click", expandDayBtn);

        //Add new meal expand form btn
        document.querySelector("#daysList").addEventListener("click", addNewMealFormBtn);

        //Delete the day 
        document.querySelector("#daysList").addEventListener("click", deleteDay);

        //User statistics info loading event
        document.addEventListener("DOMContentLoaded", loadStatistics);

    }


    const loadStatistics = function () {

        jQuery(document).ready(function () {
            //get the elements
            let bmi = document.getElementById("bmi"),
                daysTracking = document.getElementById("daysTracking"),
                averageCals = document.getElementById("averageCals"),
                recommendedCals = document.getElementById("recommendedCals");

            bmi.textContent = (function () {
                //Formula is as follows: 
                // square of height = height * height;
                // BMI = weight / soh
                let users = UsersController.getUsers();
                //Divide height with 100 to get it in meters format (187/100 = 1,87m)
                let height = users[0].height;
                height /= 100;
                let weight = users[0].weight;

                return (weight / (height * height)).toPrecision(4);
            })();

            daysTracking.textContent = StorageController.getDaysFromStorage().length.toString();

            averageCals.textContent = (function () {
                let data = StorageController.getMealsDaysArray();
                let kcals = 0;
                let items = ItemController.getItems();
                let numberOfDays = StorageController.getDaysFromStorage().length;
                data.forEach(function (x) {
                    items.forEach(function (y) {
                        if (y.removed == false) {
                            x.mealsId.forEach(function (meals) {
                                if (meals == y.id) {
                                    kcals += y.calories;
                                }
                            });
                        }
                    });
                });
                if (kcals == 0 || numberOfDays == 0)
                    return 0;
                else
                    return (kcals / numberOfDays).toPrecision(4);
            })();

            recommendedCals.textContent = (function () {
                // Basal Metabolic Rate
                // BMR = 10W + 6.25H - 5A + 5
                // W - Weight, H - Height, A - Age
                // Keep in mind that all of these calculations are not calculated by an expert!
                let users = UsersController.getUsers();
                let bmr = (users[0].weight * 10) + (6.25 * users[0].height) - (5 * users[0].age) + 5;
                return bmr.toString();
            })();

            //Call the jQuery method "counterUp" to simulate the statistics divs content numbers countering
            $(`.counter`).counterUp({
                delay: 10,
                time: 1000
            });
        });

    }

    const showMessage = function (message, className) {

        // Get parent
        const parent = document.querySelector('.collection-header');

        //Make sure that only one error messageDiv is displayed at the time 
        parent.childNodes.forEach(function (x) {
            if (x.id === "messageDiv") {
                x.style.display = "none";
            }
        });

        // Create div
        const div = document.createElement('div');
        //Add id
        div.id = "messageDiv"
        //Add class to div
        div.className += className;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get el to insert before
        const insertBeforeEl = document.querySelector('.collection-header h5');

        //Set the styling
        div.style.color = "white";
        div.style.padding = "1rem";
        div.style.borderRadius = "10px";
        if (className == successMsg) {
            div.style.backgroundColor = "green";
        } else {
            div.style.backgroundColor = "red";
        }


        // Insert div
        parent.insertBefore(div, insertBeforeEl);

        // Timeout after 3 sec
        setTimeout(function () {
            document.querySelector('#messageDiv').remove();
        }, 3000);
    }

    const reloadTotalCals = function (dayId) {

        //Get total calories
        let totalCals = calculateCalories(dayId);
        //Show total cals 
        UIController.showTotalCals(totalCals, dayId);
    }

    const calculateCalories = function (dayId) {
        let cals = 0;
        let items = ItemController.getItems();
        let dataArr = DaysController.getDataArr();

        //Loop through every day item and sum it's containing meals cals values
        dataArr.forEach(function (x) {
            if (x.day == dayId) {
                items.forEach(function (item) {
                    if (item.removed == false) {
                        x.mealsId.forEach(function (y) {

                            if (y == item.id) {
                                cals += item.calories;
                            }
                        });
                    }

                });
            }
        });
        return cals;
    }


    //Click on the edit btn of every meal item we hide the add btn and display update delete and back btns
    const formEditState = function (formId) {
        document.querySelector(`#update-btn-${formId}`).style.display = "inline-block";
        document.querySelector(`#delete-btn-${formId}`).style.display = "inline-block";
        document.querySelector(`#back-btn-${formId}`).style.display = "inline-block";

        document.querySelector(`#add-btn-${formId}`).style.display = "none";
    }

    const addItemToFormUI = function (dayId) {
        //Added dayId to be able to differentiate which li-input we need to update
        document.getElementById(`item-name-${dayId}`).value = ItemController.getCurrentItem().name;
        document.getElementById(`item-calories-${dayId}`).value = ItemController.getCurrentItem().calories;

        formEditState(dayId);
    }


    //Validate name input
    const validateName = function (dayId) {
        let value = document.getElementById(`item-name-${dayId}`);
        const regex = /^[a-zA-Z0-9_ ]{3,50}$/;
        //Regex allows all letters, numbers, "_" and " " as an input, and it must be 3-50 chars long

        if (!regex.test(value.value)) {
            //Set the span error text to color:red
            document.getElementById(`name-span-${dayId}`).style.color = "red";
            //Add a new class "invalid" to input field
            document.getElementById(`item-name-${dayId}`).className += " invalid";
            //Set the error message
            showMessage("Please fix the errors below!", failedMsg);
            return false;
        } else {
            //If true hide the error text
            document.getElementById(`name-span-${dayId}`).style.color = "transparent";
            //Add a new class "valid" to input field
            document.getElementById(`item-name-${dayId}`).className += " valid";
            return true;
        }
    }
    //Validate calories input
    const validateCals = function (dayId) {
        let value = document.getElementById(`item-calories-${dayId}`);
        const regex = /^[0-9]{1,}$/i;
        //Regex only allows only number input and it must be inputed at least once

        if (!regex.test(value.value)) {
            //Set the span error text to color:red
            document.getElementById(`calories-span-${dayId}`).style.color = "red";
            //Add a new class "invalid" to input field
            document.getElementById(`item-calories-${dayId}`).className += " invalid";
            //Set the error message
            showMessage("Please fix the errors below!", failedMsg);
            return false;
        } else {
            //If true hide the error text
            document.getElementById(`calories-span-${dayId}`).style.color = "transparent";
            //Add a new class "valid" to input field
            document.getElementById(`item-calories-${dayId}`).className += " valid";
            return true;
        }
    }

    //Clear span validate textContent
    const clearSpanText = function (dayId) {
        document.getElementById(`calories-span-${dayId}`).style.color = "transparent";
        document.getElementById(`name-span-${dayId}`).style.color = "transparent";
    }

    const itemEditClick = function (e) {

        if (e.target.classList.contains("edit-item")) {

            const listId = e.target.parentNode.parentNode.id;
            //The result will be item-0
            //We want to split it into array,  item 0
            const listIdArr = listId.split("-");
            //The result: ["item", "0"];

            //Get the actual ID
            const id = parseInt(listIdArr[1]);

            //Get item
            const itemToEdit = ItemController.getItemForEdit(id);

            ItemController.setCurrentItem(itemToEdit);

            //Get the dayId == (day-1)
            let dayIdStr = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
            //Extract the number
            let dayIdArr = dayIdStr.split("-");
            let dayId = parseInt(dayIdArr[1]);


            //Get the child elms of the li, loop through and set the form to display block
            let childEls = e.target.parentNode.parentNode.parentNode.parentNode.childNodes;
            for (let index = 0; index < childEls.length; index++) {
                if (childEls[index].classList == "card-content") {
                    childEls[index].style.display = "block";

                    //Add currentItem to update form
                    addItemToFormUI(dayId);

                    clearSpanText(dayId);

                    //Get the length of childNodes, btw button addNewMealBtn is always going to be second to last
                    // which is why when we're removing it we target length - 2
                    let length = childEls[3].childNodes.length;
                    //Clear the "ADD MEAL" btn
                    if (childEls[3].childNodes[length - 2].style.display === "block") {
                        childEls[3].childNodes[length - 2].style.display = "none";
                    }
                }

            }
        }
        e.preventDefault();
    }


    const itemEditSubmit = function (e) {

        if (e.target.classList.contains("update-btn")) {
            let dayId = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.childNodes[3].id;
            dayId = dayId.split("-").pop();

            //validate name and cals through the fctions
            let nameVal = validateName(dayId),
                calsVal = validateCals(dayId);
            //Check if both are valid
            if (nameVal === true && calsVal === true) {
                //Update in item controller
                ItemController.updateItem(dayId);
                let itemToUpdate = ItemController.getCurrentItem();
                //Update in UI
                UIController.editListItem(itemToUpdate, dayId);

                //Edit item in LocalStorage
                StorageController.updateItemInStorage(itemToUpdate);

                UIController.populateItemList(ItemController.getItems(), dayId);


                let ObjToInitialize = e.target.parentElement.children;
                initializeReadyState(ObjToInitialize);
                reloadTotalCals(dayId);

                showMessage(`Meal ${itemToUpdate.name} successfully updated!`, successMsg);

                loadStatistics();
            }

        }

        e.preventDefault();
    }


    const deleteItem = function (e) {

        if (e.target.classList.contains("delete-btn")) {

            $(e.target).click(function () {
                //Get delete item
                let deleteItem = ItemController.getCurrentItem();
                let deleteItemID = deleteItem.id;
                $.confirm({
                    'title': 'Delete Confirmation',
                    'message': 'You are about to delete the selected meal. <br />It cannot be restored at a later time! Continue?',
                    'buttons': {
                        'Yes': {
                            'class': 'blue',
                            'action': function () {
                                //Delete from data structure
                                ItemController.deleteItem(deleteItem.id);

                                //Delete from UI
                                UIController.deleteItem(deleteItem.id);

                                //Delete item from LocalStorage
                                StorageController.deleteItemFromStorage(deleteItem.id);

                                let dayId = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
                                dayId = dayId.split("-").pop();

                                //Delete item from daysMealsArr from LS
                                StorageController.deleteMealFromDayMealArr(dayId, deleteItemID);

                                reloadTotalCals(dayId);

                                let ObjToInitialize = e.target.parentElement.children;

                                initializeReadyState(ObjToInitialize);

                                showMessage(`Meal ${deleteItem.name} successfully deleted!`, successMsg);
                                loadStatistics();
                            }
                        },
                        'No': {
                            'class': 'gray',
                            'action': function () { }	// Nothing to do in this case. You can as well omit the action property.
                        }
                    }
                });

            });

        }

        e.preventDefault();
    }

    const backToAdd = function (e) {
        if (e.target.classList.contains("back-btn")) {

            let dayId = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.id;
            dayId = dayId.split("-").pop();

            let ObjToInitialize = e.target.parentElement.children;
            initializeReadyState(ObjToInitialize);

            clearSpanText(dayId);
        }

        e.preventDefault();
    }


    const itemAddSubmit = function (e) {


        if (e.target.classList.contains("add-btn")) {
            //Get the dayId
            let dayId = e.target.parentNode.parentNode.parentNode.parentNode.id;
            dayId = dayId.split("-").pop();

            //Get the input values
            let name = document.getElementById(`item-name-${dayId}`).value;
            let calories = document.getElementById(`item-calories-${dayId}`).value;

            //Validate input values
            let nameVal = validateName(dayId),
                calsVal = validateCals(dayId);
            if (nameVal === true && calsVal === true) {
                //Add new item to ItemCtrl
                const newItem = ItemController.addItem(name, calories, dayId);

                //Add new meal to that specific day
                DaysController.addMealToDay(newItem.id, dayId);

                //Reload populate items list
                UIController.populateItemList(ItemController.getItems(), dayId);

                reloadTotalCals(dayId);

                //Store in local storage
                StorageController.storeItem(newItem);


                //Clear inputs
                let obj = e.target.parentElement.children;
                initializeReadyState(obj);

                clearSpanText(dayId);

                showMessage(`Meal ${name} successfully added!`, successMsg);

                loadStatistics();
            }

        }

        e.preventDefault();
    }

    const addNewDay = function (e) {
        //Create a new day and push it to its data arr
        let day = DaysController.addNewDay();

        //Reload days in UI
        UIController.populateDaysList();

        showMessage(`Day ${day.id} successfully added!`, successMsg);

        loadStatistics();

        e.preventDefault();
    }

    const deleteDay = function (e) {
        //Check if delete icon is clicked
        if (e.target.classList.contains("deleteDay")) {

            $(e.target).click(function () {

                $.confirm({
                    'title': 'Delete Confirmation',
                    'message': 'You are about to delete this day. <br />It cannot be restored at a later time! Continue?',
                    'buttons': {
                        'Yes': {
                            'class': 'blue',
                            'action': function () {
                                //Get the id of card div el and extract the number from string
                                let dayID = e.target.parentNode.parentNode.parentNode.id;
                                dayID = dayID.split("-").pop();

                                let dataArr = DaysController.getDataArr();
                                //Delete every item from ls from this day
                                dataArr.forEach(function (x) {
                                    if (x.day == dayID) {
                                        x.mealsId.forEach(function (y) {
                                            StorageController.deleteItemFromStorage(y);
                                        });
                                    }
                                });
                                //Delete DM obj from storage
                                StorageController.deleteDayMealObject(dayID);
                                //Delete day from storage
                                StorageController.deleteDayFromStorage(dayID);
                                //Reload days in UI
                                UIController.populateDaysList();

                                showMessage(`Day ${dayID} successfully deleted!`, successMsg);

                                loadStatistics();
                            }
                        },
                        'No': {
                            'class': 'gray',
                            'action': function () { }	// Nothing to do in this case. You can as well omit the action property.
                        }
                    }
                });

            });

        }


    }

    const expandDayBtn = function (e) {
        //Check if expand icon is clicked
        if (e.target.classList.contains("expandMore")) {


            //Get the id of card div el and extract the number from string
            let dayID = e.target.parentNode.parentNode.parentNode.id;
            dayID = dayID.split("-").pop();


            //Extract the card div into a variable
            let cardDiv = document.querySelector(`#card-${dayID}`);
            //Get the existing classes
            let previousClassNames;


            //jQuery hide/show fction
            $(e.target).click(function () {

                if (cardDiv !== null) {
                    //Check for class, if it doesnt contain it, it means that we need to expand || show the div 
                    if (cardDiv.classList.contains("clicked") == false) {
                        //Call the jQuery slideDown method
                        $(cardDiv).slideDown(1000, function () {

                            cardDiv.style.display = "block";
                            previousClassNames = cardDiv.className;
                            cardDiv.className += " clicked";

                            let items = ItemController.getItems();
                            UIController.populateItemList(items, dayID);
                            reloadTotalCals(dayID);


                        });
                    }
                    else {
                        //Call the jQuery slideUp method
                        $(cardDiv).slideUp(1000, function () {

                            //If true collapse the div and set className to previous var
                            cardDiv.style.display = "none";
                            cardDiv.className = previousClassNames;
                        });

                    }
                }
            });

        }

    }


    //This method is used to initialize ready state in form in which we add new meal
    const initializeReadyState = function (event) {
        event = Array.from(event);
        event.forEach(function (x) {
            if (x.classList.contains("update-btn") || x.classList.contains("delete-btn") || x.classList.contains("back-btn")) {
                x.style.display = "none";
            }
            else if (x.classList.contains("add-btn")) {
                x.style.display = "inline-block";
            }
            else if (x.classList.contains("input-field")) {
                x.firstElementChild.value = "";
                //Remove valid or invalid class on init to return input to original state
                x.firstElementChild.className = "validate";
            }
        });
    }

    const addNewMealFormBtn = function (e) {
        //When you click on the button "ADD NEW MEAL" the form shows up

        if (e.target.classList.contains("addNewMealBtn")) {
            //Remove the button "ADD NEW MEAL" from UI 
            e.target.style.display = "none";

            //Get the child elms of the li, loop through and set the form to display block
            let childEls = e.target.parentNode.parentNode.childNodes;

            for (let index = 0; index < childEls.length; index++) {
                if (childEls[index].classList == "card-content") {
                    childEls[index].style.display = "block";

                    //Complicated way of searching for add remove update and back btn, and also the input fields 
                    let childrenOfMyEl = e.target.parentElement.parentElement.children[2].children[1].children[0].children;
                    initializeReadyState(childrenOfMyEl);
                }
            }

        }


        e.preventDefault();
    }


    return {
        initialize: function () {

            let user = UsersController.getUsers();
            if (user.length > 0) {
                //Populate user information div
                UIController.populateUserInfoDiv(user);

            }
            // Fetch days
            let days = DaysController.getDays();
            //Chech for any days in ls
            if (days.length > 0) {
                UIController.populateDaysList();
            }
            //Load event listeners
            loadEventListeners();

        }
    }
})(StorageController, UsersController, ItemController, UIController);

AppController.initialize();