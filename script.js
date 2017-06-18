(function(){
    var app = angular.module('myApp',[]);
    var grabbed = false;
    var id;
    var board = document.getElementsByTagName('body')[0];
    var askForDelete = document.getElementById('askForDelete');

    app.controller('indexController',['$scope','addEvents','$compile','colorsFactory',function($scope,addEvents,$compile,colorsFactory){
        
        $scope.maxHeight = 0;
        
        // Wywoływanie funkcji po załadowaniu
        
        window.addEventListener('load',function(){addEvents();newColors();maxNoteHeight()});
        
        // Wywoływanie funkcji po zmianie wielkości ekranu
        
        window.addEventListener('resize',function(){maxNoteHeight()});
        
        //Dodawanie notatek
        
        $scope.addNote = function(){
            var newNote = $compile('<div note></div>')($scope);
            var maxHeight = document.getElementsByTagName('body')[0].offsetHeight - 100;
            board.appendChild(newNote[0]);
        };
        
        // Potwierdzenie usunięcia i usunięcie
        
        $scope.approveDelete = function()
        {
            var notes = document.getElementsByClassName('note');
            for(i=0;i<notes.length;i++)
            {
               if(notes[i].getAttribute('data-note-number')==id)board.removeChild(notes[i]);
               askForDelete.style.visibility='hidden';
            }
        }
        
        // Odmowa usunięcia
        
        $scope.notApproveDelete = function()
        {
              askForDelete.style.visibility='hidden';
        }
        
        // Animacje zmiany koloru palety
        
        var newColors = function(){
            var elements = document.getElementsByClassName('new-color');
            for(i=0;i<elements.length;i++){
                elements[i].addEventListener('mouseover',function(){  
                    var colorLight = this.getAttribute('data-color-light');   
                    var colorDark = this.getAttribute('data-color-dark');   
                    document.getElementsByClassName('change-color')[0].style.borderColor = colorLight;
                    this.style.backgroundColor = colorDark;
                });
                elements[i].addEventListener('mouseout',function(){    
                    var colorLight = this.getAttribute('data-color-light');   
                    this.style.backgroundColor = colorLight;
                });
            }
        }
        
        // Ustawienie maksymalnej wysokości notatki
        
        var maxNoteHeight = function(){
            $scope.maxHeight = document.getElementsByTagName('body')[0].offsetHeight - 100;
        }
        
        //Zmiana kolory notatki
        
        $scope.chooseColor = function(){
                var colorDark = this.color.dark;
                var colorLight = this.color.light;
                var notes = document.getElementsByClassName('note');
                var allOptions = document.getElementsByClassName('options');
                document.getElementById('changeColor').style.visibility='hidden';
                for(i=0;i<allOptions.length;i++)allOptions[i].classList.remove('show-options');
                for(i=0;i<notes.length;i++)
                {
                   if(notes[i].getAttribute('data-note-number')==id)
                   {
                       notes[i].style.backgroundColor = colorLight;
                       notes[i].childNodes[1].style.backgroundColor = colorDark;
                       notes[i].childNodes[5].childNodes[1].style.backgroundColor = colorLight;
                   }
                }
        }
        $scope.colors = colorsFactory;
    }]);
    

    app.directive('note',function(){
        return {
            restrict: 'A',
            scope:true,
            templateUrl: 'note.html',
            replace:true,
            link : function($scope,elem,attrs)
            {
                var nodes = elem[0].childNodes,
                    content,options;
                    $scope.percentage=0;
                
                for(i=0;i<nodes.length;i++)
                {
                   if(nodes[i].classList == 'note-content')content = nodes[i];
                   if(nodes[i].classList == 'options')options = nodes[i];
                }
                
                // Wysuwanie notatek do przodu
                
                elem[0].addEventListener('click',function(e){
                    var notes = document.getElementsByClassName('note');
                    for(i=0;i<notes.length;i++)
                    {
                        notes[i].style.zIndex ='2';
                    }
                    elem[0].style.zIndex='3';
                });
                
                // Otworzenie listy z opcjami
                
                $scope.openOptions = function()
                {
                    
                    // Jeśli już otwarta zamknij wszystkie
                    
                    if(options.classList.length==2){
                        var allOptions = document.getElementsByClassName('options');
                        var allNotes = board.childNodes;
                        for(i=0;i<allOptions.length;i++)allOptions[i].classList.remove('show-options');
                        for(i=0;i<allNotes.length;i++)if(allNotes[i].classList=='note')allNotes[i].style.zIndex = '2';
                    }
                    
                    // Jeśli nie otwarta zamknij wszystkie inne i otwórz tylko tą
                    
                    else 
                    {
                        var pos;
                        (board.offsetWidth - elem[0].offsetLeft < 400) ? pos='left' : pos='right'; 
                        if(pos=='left')
                        {
                            options.style.left = '-150px';
                            options.style.right = 'auto';
                        }
                        else
                        {
                            options.style.right = '-150px';
                            options.style.left = 'auto';
                        }
                        var allOptions = document.getElementsByClassName('options');
                        for(i=0;i<allOptions.length;i++)allOptions[i].classList.remove('show-options');
                        var allNotes = board.childNodes;
                        for(i=0;i<allNotes.length;i++)if(allNotes[i].classList=='note')allNotes[i].style.zIndex = '2';
                        options.classList.add('show-options');
                        elem[0].style.zIndex = '10';
                    }

                }
                
                // Zamykanie listy opcji na przycisk zamknij
                
                $scope.closeOptions = function(){
                    options.classList.remove('show-options');
                    elem[0].style.zIndex = '2';
                }
                
                // Zamykanie listy opcji po kliknieciu na tablice
                
                board.addEventListener('click',function(e){
                    if(e.target.classList[0] =='board')
                    {
                        var allOptions = document.getElementsByClassName('options');
                        for(i=0;i<allOptions.length;i++)allOptions[i].classList.remove('show-options'); 
                        var allNotes = board.childNodes;
                        for(i=0;i<allNotes.length;i++)if(allNotes[i].classList=='note')allNotes[i].style.zIndex = '2';
                        elem[0].style.zIndex = '2';
                    }

                });
                
                // Wywołanie popupu z usunieciem notatki
                
                $scope.deleteNote = function(){
                    id='note'+$scope.$id;
                    document.getElementById('askForDelete').style.visibility='visible';
                }
                
                // Wywołanie popupu ze zmianą koloru notatki
                
                $scope.changeColor = function(){
                    id='note'+$scope.$id;
                    document.getElementById('changeColor').style.visibility='visible';
                }
                
                // Dodawanie tekstu
                
                $scope.addText = function(){
                    var newElementContainer = document.createElement('div');
                    var newText = document.createElement('textarea');
                    var deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-button');
                    deleteButton.addEventListener('click',deleteElement);
                    newText.setAttribute('placeholder','Miejsce na tekst...');
                    newText.setAttribute('spellcheck','false');
                    newText.classList.add('text');
                    newElementContainer.appendChild(newText);
                    newElementContainer.appendChild(deleteButton);                    
                    newElementContainer.classList.add('note-element');                    
                    content.appendChild(newElementContainer);
                }
                
                // Dodanie zadania
                
                $scope.addTasks = function(){
                    var newElementContainer = document.createElement('div');
                    var taskText = document.createElement('textarea');
                    var taskDone = document.createElement('input');
                    var deleteButton = document.createElement('button');
                    var label = document.createElement('label');
                    var icon = document.createElement('i');
                    icon.classList.add('fa')
                    icon.classList.add('fa-check');
                    icon.setAttribute('aria-hidden','true');
                    taskDone.setAttribute('type','checkbox');
                    taskText.setAttribute('placeholder','Zadanie...');
                    taskText.setAttribute('spellcheck','false');
                    taskText.classList.add('task');
                    deleteButton.classList.add('delete-button');
                    deleteButton.addEventListener('click',deleteElement);
                    newElementContainer.classList.add('note-element'); 
                    newElementContainer.style.borderColor='red'; 
                    label.appendChild(icon);
                    label.appendChild(taskDone);
                    label.classList.add('task-done');
                    label.addEventListener('click',checkTasks);
                    newElementContainer.appendChild(taskText);
                    newElementContainer.appendChild(label);                    
                    newElementContainer.appendChild(deleteButton);                    
                    content.appendChild(newElementContainer);
                    
                    progressBar();
                }
                
                // Usuwanie elementów
                
                function deleteElement(){
                    var toDelete = this.parentElement;
                    this.parentElement.parentElement.removeChild(toDelete);
                    if(this.parentElement.childNodes[0].classList == 'task')progressBar();
                }
                
                // Sprawdź listę zadań
                
                function checkTasks(){
                    if(this.childNodes[1].checked == true)
                    {
                        this.childNodes[0].style.visibility ='visible';
                        this.parentElement.style.borderColor = '#04be04';
                    }
                    else
                    {
                        this.childNodes[0].style.visibility ='hidden';
                        this.parentElement.style.borderColor = 'red';
                    }
                    progressBar();
                }
                
                // Zadania progress baru
                
                function progressBar(){
                    var contentElements = nodes[5].childNodes,count=0,done=0;
                    for(i=0;i<contentElements.length;i++)
                    {
                        if(contentElements[i].classList!=undefined && contentElements[i].classList[0]=='note-element'&&contentElements[i].childNodes[0].classList[0]=='task')
                        {
                            count++;
                            if(contentElements[i].style.borderColor!='red')done++;
                        }
                    }
                    if(count==0)contentElements[1].style.display = 'none';
                    else contentElements[1].style.display = 'block';
                    var phase = $scope.$root.$$phase;                    
                    $scope.percentage=Math.floor((done/count)*100);  
                    if($scope.percentage<=20)$scope.barColor='#e62626';
                    else if($scope.percentage<=40)$scope.barColor='#f29d39';
                    else if($scope.percentage<=60)$scope.barColor='#ffff00';
                    else if($scope.percentage<=80)$scope.barColor='#8ce315';
                    else $scope.barColor='#2db90c';
                        
                    if(phase != '$apply' && phase != '$digest')$scope.$apply();
                }  
            }
        }
    });  

    app.factory('addEvents',[function(){
        return function(){
            var grabbedElement,
            mouseX=false,mouseY=false,noteX=false,noteY=false;
            
            // Chwytanie notatki
            
            board.addEventListener('mousedown',function(e){        
                if(e.target.className == 'grab-note')
                {
                    grabbed=true;
                    grabbedElement=e.target.parentElement;
                    e.target.parentElement.className += ' grabbed';
                    e.target.style.cursor = 'grabbing';
                }
            });
            
            // Puszczanie notatki
            
            board.addEventListener('mouseup',function(e){
                if(grabbed)
                {
                    var grabers = document.getElementsByClassName('grab-note');
                    mouseX=false;
                    mouseY=false;
                    noteX=false;
                    noteY=false;
                    grabbed=false;
                    document.getElementsByClassName('grabbed')[0].className ='note';
                    for(i=0;i<grabers.length;i++)
                    {
                        grabers[i].style.cursor = 'grab';
                    } 
                }                   
            });
            
            // Przemieszczanie się notatki
            
            board.addEventListener('mousemove',function(e){
                if(grabbed)
                {
                    if(!mouseX&&!mouseY)
                    {
                        mouseX = e.screenX;
                        mouseY = e.screenY;
                        noteY = parseInt(grabbedElement.style.top);
                        noteX = parseInt(grabbedElement.style.left);
                    }
                    mouseX-=e.screenX;
                    mouseY-=e.screenY;
                    noteX-=mouseX;
                    noteY-=mouseY;
                    grabbedElement.style.top = noteY + 'px';
                    grabbedElement.style.left = noteX + 'px';
                    mouseX=e.screenX;
                    mouseY=e.screenY;
                }
            });
            
            // Zwiekszanie sie textarea
            
            board.addEventListener('keyup',function(e){
                if(e.target.tagName.toLowerCase() == 'textarea')
                {
                    e.target.style.height = "1px";
                    e.target.style.height = (e.target.scrollHeight)+"px";
                }
                
            });
            
            // Zamykanie zmiany koloru
            
            document.getElementById('changeColor').addEventListener('click',function(e){
                if(e.target.getAttribute('id')=='changeColor')e.target.style.visibility ='hidden';
            });
        }
    }]);

    app.factory('colorsFactory',function(){
         return {
                1: {
                    light: '#ffff00',
                    dark: '#dbdb02'
                },
                2: {
                    light:'#ff8000',
                    dark:'#c46301'
                },
                3: {
                    light:'#f25757',
                    dark:'#b94343'
                },
                4: {
                    light:'#ff00c5',
                    dark:'#c7069b'
                },
                5: {
                    light:'#b100ff',
                    dark:'#8702c1'
                },
                6: {
                    light:'#004eff',
                    dark:'#021cac'
                },
                7: {
                    light:'#00fff5',
                    dark:'#04b4ad'
                },
                8: {
                    light:'#00ff89',
                    dark:'#00b260'
                },
                9: {
                    light:'#80ff00',
                    dark:'#53a501'
                },
                10: {
                    light:'#ffffff',
                    dark:'#a5a5a5'
                },
            }
    });

}())

