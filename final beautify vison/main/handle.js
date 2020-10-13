
var ijson;
function delItem(item, list) {
    var x = list.indexOf(item);    
    if (x == -1) {            
        return;
    }
    list.splice(x, 1)
    delItem(item, list);
}

function strParse() {       
    var tree = {
        "name": '师门树',
        "children": [

        ]
    };
    var teacher = {
        "name": '',
        "children": [

        ]
    };
    var degree = {
        "name": '',
        "children": [

        ]
    }

    var person = {
        "name": '',
        "children": [

        ]
    }

    var job = {
        "name": '',
        "children": [

        ]
    }

    var year = {
        "name": '',
        "children": [

        ]
    }
    //tree.children.push(teacher);
    //tree.children.push(teacher);
    //alert(JSON.stringify(tree));						


    var data = new String;
    var n = document.getElementById("textbox").value; 
    var y = sessionStorage.getItem("y");    
    if(n == "")//拖拽文件输入
    {        
        y = y.replace(/\\r\\n/g, '\n');        
        data = y;            
    }
    else //输入框输入
    {
        data = n;     
    }        
    var num = 0;
    var StuParts = [];
    var teachers = data.split(/\n\n\n/g); //按导师分块				
    for (var i in teachers) {
        StuParts[num] = teachers[i].split(/[\n, \n\n]/g); //导师
        //内按行分块				
        delItem("", StuParts[num]); //取消空行        
        num++;
    }

    for (var i in StuParts) {
        var k = -1;
        var degrees = "";
        var years = "";
        var jobs = "";
        var name = "";

        var persons = [];
        //parse persons first to be selected
        for (var j = 1; j < StuParts[i].length; j++) {
            k = -1;
            jobs = "";
            name = "";
            if (!(StuParts[i][j][0] >= '0' && StuParts[i][j][0] <= '9')) {
                while (StuParts[i][j][++k] != "：") //person name parse 
                {
                    name += StuParts[i][j][k];
                }
                person.name = name;

                while (++k < StuParts[i][j].length) //job parse
                {

                    if (StuParts[i][j][k] != '、') {
                        jobs += StuParts[i][j][k];
                    } else {
                        jobs = {
                            "name": jobs
                        };
                        person.children.push(jobs); //job insert
                        jobs = "";
                    }

                }
                jobs = {
                    "name": jobs
                };
                person.children.push(jobs);
                jobs = "";
                persons.push(person); //person union						
                var person = {
                    "name": '',
                    "children": [

                    ]
                }
            }

        }
        //the above OK			
        //then parse degrees

        for (var j = 1; j < StuParts[i].length; j++) {
            k = -1;
            degrees = "";
            years = "";
            name = "";
            if (StuParts[i][j][0] >= '0' && StuParts[i][j][0] <= '9') {

                while (StuParts[i][j][++k] != "级") { //years
                    years += StuParts[i][j][k];
                }
                while (StuParts[i][j][++k] != "：") { //degrees
                    degrees += StuParts[i][j][k];
                }
                year.name = years;
                degree.name = degrees;

                //person parse and insert year
                while (++k < StuParts[i][j].length) {
                    if (StuParts[i][j][k] != '、') {
                        name += StuParts[i][j][k];
                    } else {

                        var flag = true;
                        for (var o in persons) {
                            if (persons[o].name == name) {
                                year.children.push(persons[o]);
                                flag = false;
                                break;
                            }
                        }
                        if (flag == true) {
                            person = {
                                "name": '',
                                "children": [

                                ]
                            }
                            person.name = name;
                            year.children.push(person);
                        }
                        name = "";
                    }

                } {
                    var flag = true;
                    for (var o in persons) {
                        if (persons[o].name == name) {
                            year.children.push(persons[o]);
                            flag = false;
                            break;
                        }
                    }
                    if (flag == true) {
                        person = {
                            "name": '',
                            "children": [

                            ]
                        }
                        person.name = name;
                        year.children.push(person);
                    }
                    name = "";
                }

                //year insert degree and degree insert teacher
                var flag = true;
                for (var o in teacher.children) { //judge if degree `d in teacher 
                    if (teacher.children[o].name == degree.name) {
                        teacher.children[o].children.push(year);
                        flag = false;
                        break;
                    }
                }
                if (flag == true) {
                    degree.children.push(year);
                    teacher.children.push(degree)
                }
                year = {
                    "name": '',
                    "children": [

                    ]
                }
                degree = {
                    "name": '',
                    "children": [

                    ]
                }
            }

        }
        var x = StuParts[i][0].indexOf("：");
        var teacherName = "";
        while (++x < StuParts[i][0].length) {
            teacherName += StuParts[i][0][x];
        }
        teacher.name = teacherName;
        tree.children.push(teacher);
        teacher = {
            "name": '',
            "children": [

            ]
        };
    }    
    
    ijson = JSON.stringify(tree);       
    sessionStorage.setItem("x", ijson);    
    location.reload();

}

//strParse()函数用于测试的版本
function strParse_Test(testCase) {
    var tree = {
        "name": '师门树',
        "children": [

        ]
    };
    var teacher = {
        "name": '',
        "children": [

        ]
    };
    var degree = {
        "name": '',
        "children": [

        ]
    }

    var person = {
        "name": '',
        "children": [

        ]
    }

    var job = {
        "name": '',
        "children": [

        ]
    }

    var year = {
        "name": '',
        "children": [

        ]
    }
    //tree.children.push(teacher);
    //tree.children.push(teacher);
    //alert(JSON.stringify(tree));						


    var name = new String;
    name = testCase;

    var num = 0;
    var StuParts = [];
    var teachers = name.split(/\n\n\n/g); //按导师分块				
    for (var i in teachers) {
        StuParts[num] = teachers[i].split(/[\n, \n\n]/g); //导师
        //内按行分块				
        delItem("", StuParts[num]); //取消空行
        num++;
    }

    for (var i in StuParts) {
        var k = -1;
        var degrees = "";
        var years = "";
        var jobs = "";
        var name = "";

        var persons = [];
        //parse persons first to be selected
        for (var j = 1; j < StuParts[i].length; j++) {
            k = -1;
            jobs = "";
            name = "";
            if (!(StuParts[i][j][0] >= '0' && StuParts[i][j][0] <= '9')) {
                while (StuParts[i][j][++k] != "：") //person name parse 
                {
                    name += StuParts[i][j][k];
                }
                person.name = name;

                while (++k < StuParts[i][j].length) //job parse
                {

                    if (StuParts[i][j][k] != '、') {
                        jobs += StuParts[i][j][k];
                    } else {
                        jobs = {
                            "name": jobs
                        };
                        person.children.push(jobs); //job insert
                        jobs = "";
                    }

                }
                jobs = {
                    "name": jobs
                };
                person.children.push(jobs);
                jobs = "";
                persons.push(person); //person union						
                var person = {
                    "name": '',
                    "children": [

                    ]
                }
            }

        }
        //the above OK			
        //then parse degrees

        for (var j = 1; j < StuParts[i].length; j++) {
            k = -1;
            degrees = "";
            years = "";
            name = "";
            if (StuParts[i][j][0] >= '0' && StuParts[i][j][0] <= '9') {

                while (StuParts[i][j][++k] != "级") { //years
                    years += StuParts[i][j][k];
                }
                while (StuParts[i][j][++k] != "：") { //degrees
                    degrees += StuParts[i][j][k];
                }
                year.name = years;
                degree.name = degrees;

                //person parse and insert year
                while (++k < StuParts[i][j].length) {
                    if (StuParts[i][j][k] != '、') {
                        name += StuParts[i][j][k];
                    } else {

                        var flag = true;
                        for (var o in persons) {
                            if (persons[o].name == name) {
                                year.children.push(persons[o]);
                                flag = false;
                                break;
                            }
                        }
                        if (flag == true) {
                            person = {
                                "name": '',
                                "children": [

                                ]
                            }
                            person.name = name;
                            year.children.push(person);
                        }
                        name = "";
                    }

                } {
                    var flag = true;
                    for (var o in persons) {
                        if (persons[o].name == name) {
                            year.children.push(persons[o]);
                            flag = false;
                            break;
                        }
                    }
                    if (flag == true) {
                        person = {
                            "name": '',
                            "children": [

                            ]
                        }
                        person.name = name;
                        year.children.push(person);
                    }
                    name = "";
                }

                //year insert degree and degree insert teacher
                var flag = true;
                for (var o in teacher.children) { //judge if degree `d in teacher 
                    if (teacher.children[o].name == degree.name) {
                        teacher.children[o].children.push(year);
                        flag = false;
                        break;
                    }
                }
                if (flag == true) {
                    degree.children.push(year);
                    teacher.children.push(degree)
                }
                year = {
                    "name": '',
                    "children": [

                    ]
                }
                degree = {
                    "name": '',
                    "children": [

                    ]
                }
            }

        }
        var x = StuParts[i][0].indexOf("：");
        var teacherName = "";
        while (++x < StuParts[i][0].length) {
            teacherName += StuParts[i][0][x];
        }
        teacher.name = teacherName;
        tree.children.push(teacher);
        teacher = {
            "name": '',
            "children": [

            ]
        };
    }    
    
    ijson = JSON.stringify(tree);           
    return ijson;
}