"use strict";
/**
 * Innehåller defintionen för {@link cousinCalc}
 * @author Hanif Bali
 * @file
 * @version 0.3.5
 */


$('.person').draggable();



/**
 * Hjälpmedel för att visualisera relationerna.
 * @namespace cousinCalc
 */
let cousinGraph = {
    removeLine: function(person1, person2){
        jQuery("."+person1.id +"to"+person2.id).remove();

    },

    createLine: function(person1, person2){

        let line =  document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute('stroke', 'red');
        line.setAttribute('class', person1.id +"to"+person2.id +" "+person2.id+"to"+person1.id);
        line = $(line);

        let pos1 = jQuery("#"+person1.id).position();
        let pos2 = jQuery("#"+person2.id).position();
        line
            .attr('x1', pos1.left)
            .attr('y1', pos1.top)
            .attr('x2', pos2.left)
            .attr('y2', pos2.top);
        jQuery("#svg").append(line);
    },

    /**
     * Visuell hjälpare att koppla ihop individ med en förälder
     * @param that
     */
 addParent: function(that){
    that = jQuery(that.parentNode);
    let  person =   that.data('person');
    let pos1 = that.position();


    let line1 = jQuery('#line1');


    $("#playground").bind('mousemove',function(e){
        line1
            .attr('x1', pos1.left)
            .attr('y1', pos1.top)
            .attr('x2', e.clientX - 10)
            .attr('y2', e.clientY - 176);

    });


     /**
      * När man klickar på en visuell representation av en person
      */
     jQuery('.person').click(function (e) {

        /**
         * Skapa ej relation med sig själv.
         */
        if(that.is(this)){
            return;
        }

        /**
         * Få tag på den klickade personens Person-objekt
         * @var otherPerson
         * @type {Person}
         */
        let otherPerson = jQuery(this).data('person');


        if(otherPerson.isChildOf(person)) // Kan inte bli förälder till ens förälder.
            return false;

        person.addParent(otherPerson);
        otherPerson.addChildren(person);

        if(otherPerson.gender === 'f') {
            if(person.mother){
                cousinGraph.removeLine(person.mother, person);
            }
        } else {
            if(person.father){
                cousinGraph.removeLine(person.father, person);
            }
        }

         cousinGraph.createLine(person, otherPerson);
        close();

    });

    /**
     *  Escape key
     * */
    jQuery('body').keydown(function(e){

        if(e.keyCode === 27){
            close();
        }
    });

    function close() {
        line1
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);
        jQuery("#playground").unbind("mousemove");
        jQuery('body').unbind("keydown")
        jQuery(".person").unbind('click');
    }

},

    newPerson: function (person) {

        let genderClass = person.gender === 'm' ? 'male' : 'female';


        let div = $(" <div class='person "+ genderClass +"'>\n" +
            "        <button onclick=\"cousinGraph.addParent(this)\">+</button>\n" +
            "        <div class='inner'></div><button>+</button>\n" +
            "    <button>+</button>\n" +
            "    </div>");


        div.uniqueId();

        div.draggable();
        jQuery(div).hover(function () {
            jQuery(this).addClass("menu");
        }, function () {
            jQuery(this).removeClass("menu");
        });

        person.id = div.attr('id');
        div.data('person', person);

        div.appendTo("#playground");
    }
};



/**
 * Detta är hjärtat i kusingeneratorn, här laddar du och kör dina uträkningar.
 * @namespace cousinCalc
 */
let cousinCalc = {

    individuals: [],
    playground:  document.getElementById('playground'),



    coeff: function (person1, person2) {

        let ancestors1 = [];

        ancestors1 = ancestors1.concat(person1.getParents());
        for(let i = 0; i < ancestors1.length; i++){
           ancestors1 = ancestors1.concat(ancestors1[i].getParents());

            ancestors1 = ancestors1.filter((ancestor, index, self) =>
                index === self.findIndex((t) => (
                    t.id === ancestor.id
                ))
            );

        }

        let ancestors2 = [];
        ancestors2 = ancestors2.concat(person2.getParents());
        for(let i = 0; i < ancestors2.length; i++){
            ancestors2 = ancestors2.concat(ancestors2[i].getParents());

            ancestors2 = ancestors2.filter((ancestor, index, self) =>
                index === self.findIndex((t) => (
                    t.id === ancestor.id
                ))
            );

        }

        console.log(ancestors1, ancestors2);
        let common = [];
        for(let i = 0; i < ancestors1.length; i++){

            for(let i2 = 0; i2 < ancestors2.length; i2++) {
             if(ancestors1[i].id === ancestors2[i].id) {
                 common = common.concat(ancestors2[i]);
                }
            }
        }

        common = common.filter((ancestor, index, self) =>
            index === self.findIndex((t) => (
                t.id === ancestor.id
            ))
        );


        if(common.length){
            console.log("Common ancestor found");
            console.log(common);
        }

    },



    newIndividual: function(gender = 'f'){

        let person = new Person();
        person.gender = gender;
        this.individuals.push(person);
        cousinGraph.newPerson(person);
    },

    createFamily: function(){

    },
};

/**
 * Objektet som håller all info.
 * @constructor
 */
function Person()  {
    this.gender = "f";
    this.father;
    this.mother;
    this.partner;
    this.children = [];


    this.getParents = function(){
        if(this.father && this.mother)
            return [this.father, this.mother];

        else if(this.father && !this.mother)
                return [this.father];

        else if(!this.father && this.mother)
            return [this.mother];

        return [];

    };

    this.addChildren = function(person){
        this.children.push(person);
    };

    this.isChildOf = function(otherperson){
          return !!((this.mother && this.mother.id === otherperson.id) || (this.father && this.father.id === otherperson.id));
    };

    this.isParentOf = function (otherperson) {
        return !!this.children.find(obj => obj.id === otherperson.id);

    };
    this.addParent = function (person) {
        if(person.gender === "f") {
            this.mother = person;
        } else {
            this.father = person
        }

    };

}