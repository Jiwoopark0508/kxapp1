"use strict";

function tutPrompt(){
    console.log("tutPrompt.js");
    var states = {
        state0: {
            title: 'Here is where you write question',
            html: `<p>In here, you can write your own questions
                   </p>
                   <p>
                      Question types and templates will be suggested.
                   </p>
                   <p>
                      Make your own question using question templates!
                   </p>`,
            buttons: { Start: true},
            focus: 0,
            submit: (e,v) => {
                if(v){
                    e.preventDefault();
                    $.prompt.goToState('state1');
                } else {
                    $.prompt.close();
                }
            }
        },
        state1: {
            title: 'Subgoal Break Point',
            html: `<p>In here, current subgoal and your notes will be presented</p>
                   <p>You can reference these subgoal and your notes for your question generation </p>` + 
            '<img class="full-width" src="/assets/img/stage1.png" />',
            buttons: { Next: true, Prev: false},
            focus: 0,
            position: { container: '.subgoal_wrap', 
                        x: 200, 
                        y: 0, 
                        width: 300,
                        arrow: 'lt'},
            submit: (e, v) => {
                e.preventDefault();
                if(v){
                    $.prompt.goToState('state2');
                }
                else{
                    $.prompt.goToState('state0');
                }
            }
        },
        state2: {
            title: 'Question Categories',
            html: `<p>In here, question categories and question templates 
                    for that categories will be shown </p>
                   <p>At first, you should select 
                        <strong>question category.</strong>
                   </p>
                   <p>Next, select specific 
                        <strong>question template.</strong>
                   </p>` 
            + '<img class="full-width" src="/assets/img/stage2.png" />',
            buttons: { Next: true, Prev: false},
            focus: 0,
            position: {
                container: '.queCate_wrap',
                x: 200,
                y: 0,
                width: 700,
                arrow: 'lt'
            },
            submit: (e, v) => {
                e.preventDefault();
                if(v){
                    $.prompt.goToState('state3');
                }
                else{
                    $.prompt.goToState('state1');
                }
            }
        },
        state3: {
            title: 'Ask Questions and Submit It',
            html: `<p>Here is stage for submiting your questions 
                    with template you chose</p>
                   <p> In the left form, write your question, then press Add button. Then your question add to question box </p>
                   <p> After adding your question box, submit your questions by pressing Commit button</p> ` + 
                    '<img class="full-width" src="/assets/img/stage3.png" />'
                    + 
                    `<p> Then modal shows up that confirm your questions finally </p>
                    <p> Pressing Push button is the end of submission</p>`
                    +
                    '<img class="full-width" src="/assets/img/stage3_2.png" />'
                    ,
            buttons: { Next: true, Prev: false},
            focus: 0,
            position: {
                container: '.submit_wrap',
                x: 200,
                y: 0,
                width: 800,
                arrow: 'lt'
            },
            submit: (e, v) => {
                e.preventDefault();
                if(v){
                    $.prompt.goToState('state4');                    
                }
                else {
                    $.prompt.goToState('state2');
                }
            }

        },
        state4: {
            title: 'Return to Lecture or Rewatch Lecture',
            html: `<p> After submission, you can resume lecture by Back button </p>
                   <p> If you want to see lecture again while you submit question. You can use Rewatch button for rewatching previous section </p>` 
                   + 
                '<img class="full-width" src="/assets/img/stage4.png" />',
            buttons: {Close: true, Prev: false},
            focus: 0,
            position: {
                container: '.helper_wrap',
                x: 200,
                y: 0,
                width: 300,
                arrow: 'lt'
            },
            submit: (e, v) => {
                e.preventDefault();
                if(v){
                    $.prompt.close();
                }
                else{
                    $.prompt.goToState('stage3');
                }
            }
        }
    
    };

    $.prompt( states);
}

module.exports = tutPrompt;
