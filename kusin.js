"use strict";
/**
 * Innehåller defintionen för {@link cousinCalc}
 * @author Hanif Bali
 * @file
 * @version 0.3.5
 */


/**
 * Hjälpmedel för att visualisera relationerna.
 * @namespace cousinCalc
 */
let cousinGraph = {

    close: function(){
        let line1 = jQuery('#line1');
        line1
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);
        jQuery("#playground").unbind("mousemove");
        jQuery('body').unbind("keydown")
        jQuery(".person").unbind('click');

    },

    removeLine: function (parent) {
        jQuery(".parent_" + parent.id).remove();

    },

    createLines: function (person1) {

        let children = person1.getChildren();


        cousinGraph.removeLine(person1);

        for(let i=0; i<children.length;i++){

        let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute('stroke', 'red');
        line.setAttribute('class', 'parent_'+person1.id);
        line = $(line);
           let person1Div = jQuery("#" + person1.id);
        let pos1 = person1Div.position();
        let height = person1Div.height();
        let width = person1Div.width();
        let pos2 = jQuery("#" + children[i].id).position();
        line
            .attr('x1', pos1.left + (width/2))
            .attr('y1', pos1.top + height)
            .attr('x2', pos2.left + (width/2))
            .attr('y2', pos2.top);
        jQuery("#svg").append(line);
        }
    },

    /**
     * Visuell hjälpare att koppla ihop individ med en förälder
     * @param that
     */
    addParent: function (that) {
        that = jQuery(that.parentNode);
        let person = that.data('person');
        let pos1 = that.position();


        let line1 = jQuery('#line1');


        $("#playground").bind('mousemove', function (e) {
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
            if (that.is(this)) {
                return;
            }

            /**
             * Få tag på den klickade personens Person-objekt
             * @var otherPerson
             * @type {Person}
             */
            let otherPerson = jQuery(this).data('person');


            if (otherPerson.isChildOf(person)) { // Kan inte bli förälder till ens förälder.
                console.log('klicked person is already child of indivudal')
                return false;
            }

            let oldParents = person.getParents();
            for(let i=0;i<oldParents.length;i++){
                if(oldParents[i].gender === otherPerson.gender){
                    cousinGraph.removeLine(oldParents[i], person);
                }

            }

            person.addParent(otherPerson);
            otherPerson.addChildren(person);

            cousinGraph.createLines(otherPerson);
            cousinGraph.close();

        });

        /**
         *  Escape key
         * */
        jQuery('body').keydown(function (e) {

            if (e.keyCode === 27) {
                cousinGraph.close();
            }
        });


    },
    addChild: function (that) {
        that = jQuery(that.parentNode);
        let person = that.data('person');
        let pos1 = that.position();
        let line1 = jQuery('#line1');


        $("#playground").bind('mousemove', function (e) {
            line1
                .attr('x1', pos1.left)
                .attr('y1', pos1.top)
                .attr('x2', e.clientX )
                .attr('y2', e.clientY );

        });

        /**
         * När man klickar på en visuell representation av en person
         */
        jQuery('.person').click(function (e) {

            /**
             * Skapa ej relation med sig själv.
             */
            if (that.is(this)) {
                return;
            }

            /**
             * Få tag på den klickade personens Person-objekt
             * @var otherPerson
             * @type {Person}
             */
            let otherPerson = jQuery(this).data('person');

            let oldParents = otherPerson.getParents();

            for(let i=0;i<oldParents.length;i++){
                if(oldParents[i].gender === person.gender){
                    cousinGraph.removeLine(oldParents[i]);
                }

            }

            otherPerson.addParent(person);
            person.addChildren(otherPerson);
            cousinGraph.createLines(person);
            cousinGraph.close();



        });
        /**
         *  Escape key
         * */
        jQuery('body').keydown(function (e) {

            if (e.keyCode === 27) {
                cousinGraph.close();
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


        let div = $(" <div class='person " + genderClass + "'>\n" +
            "<button onclick=\"cousinGraph.addParent(this)\">+</button>\n" +
            "<div class='inner'></div>\n" +
            "<button onclick=\"cousinGraph.addChild(this)\">+</button>\n" +
            "</div>");


        div.uniqueId();

        div.draggable({stop: function (event, ui) {

                cousinGraph.createLines(person);

                let parents = person.getParents();
                for(let i=0; i<parents.length;i++){
                    cousinGraph.createLines(parents[i]);
                }

            }});
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
    playground: document.getElementById('playground'),

    /**
     *  Räknar ut släktskapskofficent för två individer.
     *
     *
     * @param person1
     * @param person2
     */
    coeff: function (person1, person2) {



    },


    newIndividual: function (gender = 'f') {

        let person = new Person();
        person.gender = gender;
        this.individuals.push(person);
        cousinGraph.newPerson(person);
    },

    createFamily: function () {

    },
};

/**
 * Objektet som håller all info.
 * @constructor
 */
function Person() {
    this.gender = "f";
    this.father;
    this.mother;
    this.children = [];

    /**
     *
     * @returns {[Array]}
     */
    this.getParents = function () {
        if (this.father && this.mother)
            return [this.father, this.mother];

        else if (this.father && !this.mother)
            return [this.father];

        else if (!this.father && this.mother)
            return [this.mother];

        return [];

    };

    /**
     * Adds children
     * @param person
     */
    this.addChildren = function (person) {
        this.children.push(person);
    };
    this.removeChild = function (person) {
        this.children = this.children.filter(function(child){
            return child.id !== person.id;
        });
    };
    this.isChildOf = function (otherperson) {
        return !!((this.mother && this.mother.id === otherperson.id) || (this.father && this.father.id === otherperson.id));
    };

    this.isParentOf = function (otherperson) {
        return !!this.children.find(obj => obj.id === otherperson.id);

    };
    this.getChildren = function(){
        return this.children;
    };

    this.addParent = function (person) {

        //notify old parent of change
        if (person.gender === "f") {
            if(this.mother){
                this.mother.removeChild(this);
            }
            this.mother = person;
        } else {
            if(this.father){
                this.father.removeChild(this);
            }
            this.father = person
        }

    };

}