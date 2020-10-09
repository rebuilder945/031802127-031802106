
var ijson;
function delItem(item, list) {
    var x = list.indexOf(item);
    if (x == -1) {
        return;
    }
    list.splice(x, 1)
    delItem(item, list);
}

function strparse() {
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
    name = document.getElementById("textbox").value;

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
    sessionStorage.setItem("x", ijson);    
    location.reload();
}

var root;

function draw() {        
    var ijson = JSON.parse(sessionStorage.getItem("x"));   
    var m = [20, 120, 20, 120],
        w = 1680 - m[1] - m[3],
        h = 800 - m[0] - m[2],
        i = 0;        

    var tree = d3.layout.tree().size([h, w]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

    var vis = d3.select("#body")
        .append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

    
    root = ijson; /////////////////////////////////////////////////////////////////json位置    
    root.x0 = h / 2;
    root.y0 = 0;

    function toggleAll(d) {
        if (d.children) {
            d.children.forEach(toggleAll);
            toggle(d);
        }
    }    
    // Initialize the display to show a few nodes.    
    
    root.children.forEach(toggleAll);
    
    for (var i = 0; i < root.children.length; i++) {
        toggle(root.children[i]);
    }
    update(root);

    // 绘制图形
    function update(source) {
        var duration = d3.event && d3.event.altKey ? 5000 : 500;

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse();

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * 180;
        });

        // Update the nodes…
        var node = vis.selectAll("g.node").data(nodes, function (d) {
            return d.id || (d.id = ++i);
        });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter()
            .append("svg:g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            }).on("click", function (d) {
                toggle(d);
                update(d);
            });

        nodeEnter.append("svg:circle")
            .attr("r", 1e-6).style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeEnter.append("svg:text")
            .attr("x", function (d) {
                return d.children || d._children ? -10 : 10;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function (d) {
                return d.name;
            }).style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        nodeUpdate.select("circle")
            .attr("r", 4.5)
            .style("fill", function (d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit()
            .transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.y + "," + source.x + ")";
            }).remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = vis.selectAll("path.link")
            .data(tree.links(nodes), function (d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter()
            .insert("svg:path", "g")
            .attr("class", "link")
            .attr("d", function (d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit()
            .transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Toggle children.
    function toggle(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
    }
}

function display() {
    /*显示树*/

    var ijson = JSON.parse(sessionStorage.getItem("x")); 
    var currentNode = {};

    currentNode = ijson;///////////////////////////////////////////////////////////////////////json位置
    var str = '<ul>';
    selectNode(currentNode);
    str += '</ul>';
    $(".tree-node").html(str)

    function selectNode(node) {
        if (node != null) {
            str +=
                `<li><span>${node.name}</span>&nbsp;&nbsp;&nbsp;<button class="addChildtree">+</button>`
            if (node.children != null && node.children.length != 0) {
                str += `<ul>`
                for (var i = 0; i < node.children.length; i++) {
                    selectNode(node.children[i]);
                }
                str += `</ul>`
            }
            str += '</li>'
        }
    }
    $(document).on("click", ".addChildtree", function () {
        var $this = $(this);
        var currentvalue = $this.siblings("span").text();
        var newChildTree = prompt("新的子类");
        if (newChildTree != null && newChildTree != "") {
            if ($this.next().length > 0) {
                $this.next().append(
                    `<li><span>${newChildTree}</span>&nbsp;&nbsp;&nbsp;<button class="addChildtree">+</button></li>`
                );
            } else {
                $this.parent().append(
                    `<ul><li><span>${newChildTree}</span>&nbsp;&nbsp;&nbsp;<button class="addChildtree">+</button></li></ul>`
                )
            }

            // 此处向root插入数据，还是没搞出来
            root = inserttree(root, currentvalue, newChildTree);
            update(root)
            // @TODO 节点所在数据位置
            function inserttree(json, currentvalue, newChildTree) {
                var currentNode = json;
                if (newChildTree != "" && newChildTree != null) {
                    if (currentNode.name == currentvalue) {
                        // 如果当前处于收缩状态则是_children有值
                        // 如果是展开则是children有值
                        // 1. 判断节点有子节点则其children为一个数组或者null，否则则为undefined
                        // 2. 如果是数组的话，则push到children里，如果是null，则push到_children里

                        if (currentNode.children === null) {
                            currentNode._children.push({
                                "name": newChildTree
                            });
                        } else if (currentNode.children instanceof Array) {
                            currentNode.children.push({
                                "name": newChildTree
                            });
                        } else {
                            currentNode.children = [];
                            currentNode.children.push({
                                "name": newChildTree
                            });
                        }
                    } else {
                        if (currentNode.children === null) {
                            for (var i = 0; i < currentNode._children.length; i++) {
                                inserttree(currentNode._children[i], currentvalue, newChildTree);
                            }
                        } else if (currentNode.children instanceof Array) {
                            for (var i = 0; i < currentNode.children.length; i++) {
                                inserttree(currentNode.children[i], currentvalue, newChildTree);
                            }
                        }
                    }
                }
                return currentNode;
            }
        }
    })
}