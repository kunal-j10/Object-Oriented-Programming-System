#include <iostream>
using namespace std;


// OOPs : Object Oriented Programming System


//     Constructor                      ->  It is a method that is invoked  automatically at the time of
//     {  Default Constructor  }            creation of an object.
//     {     InBuild           }        ->  It is used to initialize the data members of a newly created Object. {Parameterised constructor}
//     { no input parameter    }        ->  A constructor does not have any return type.
//                                      ->  A default constructor does not have any input parameters



//      Parameterised constructor :      ->  Called at the time of Object creation
//                                       ->  Takes some input parameters
//                                       ->  Helps to initialize an object when it is created
//
//       {it is basically constructor overloading }
//  



// -->> If we create our own constructor then default constructor is dead.

// -->>     when the parameterized constructor is defined and no default constructor is defined explicitly, 
//          the compiler will not implicitly call the default constructor and hence creating a simple object as
//
//          Student s;
//          Will flash an error



//      Copy Constructor :      ->  A Copy Constructor is a member function which initializes a newly created
//  {Default InBuild present}       object using another object of same class.
//                              ->  Copy Constructor takes input parameter as reference of an object of same class,
//                                  i.e object is passed by reference in case of Copy Constructor.



//      Destructor :        ->  It is also a special member function, which is used to destroy the object 
//                              created by the constructors.
//                          ->  The has the same name as the class but preceded by a (~) tilde sign.
//                          ->  Unlike constructors, there can be only one Destructor. 
//                              Hence, they can not be overloded.
//                          ->  Destructor neither requires any argument nor returns any value.
//                          ->  It is automatically called when the object goes out of scope.
//                          ->  In destructor, objects are destroyed in the reverse of object creation.



class Cars
{
    public:
    string Modal;
    string Color;
    string motionStatus;
    int horsePower;
    int maxSpeed;
    int *numberOfGears;

    void moveForward()
    {
        motionStatus="going Forward";
    }
    void moveBackward()
    {
        motionStatus="going Backward";
    }
    void turnLeft()
    {
        motionStatus="turning left";
    }
    void turnRight()
    {
        motionStatus="turning right";
    }
    
    // Setters
    void setModal(string val)
    {
        this->Modal=val; //this keyword:- "this" is a pointer that points to the current object
    }
    void setColor(string val)
    {
        this->Color= val;
    }
    void setHorsePower(int val)
    {
        this->horsePower=val;
    }
    void setMaxSpeed(int val)
    {
        this->maxSpeed=val;
    }
    void setNumberOfGears(int val)
    {
        *(this->numberOfGears) = val;
    }
    
    //Getters
    string getModal()
    {
        return Modal;
    }
    string getColor()
    {
        return Color;
    }
    string getMotionStatus()
    {
        return motionStatus;
    }
    int getHorsePower()
    {
        return horsePower;
    }
    int getMaxSpeed()
    {
        return maxSpeed;
    }
    int getNumberOfGears()
    {
        return *numberOfGears;
    }
    
    
    //****************** Constructors *********************//
    
    //  Default Constructor
    Cars()
    {
        // Allocate space for dynamic allocation of memory;
        this->numberOfGears = new int;
        
        cout<<"\n  Default Constructor called  \n";
    }
    
    //  Parameterized Constructor
    Cars(string Modal, string str, int horsePower, int maxSpeed,int numberOfGears)
    {
        cout<<"\n  Parameterized Constructor called  \n";
        
        // Allocate space for dynamic allocation of memory;
        this->numberOfGears = new int;
        
        this->Modal = Modal;
        this->Color = str;
        this->horsePower = horsePower;
        this->maxSpeed = maxSpeed;
        *(this->numberOfGears)= numberOfGears;
    }
    
    // ******Copy Constructor  { Shallow Copy }
    
    // Cars(Cars &obj)
    // {
    //     cout<<"\n  Copy Constructor called  \n";
        
    //     this->Modal= obj.Modal;
    //     this->Color= obj.Color;
    //     this->horsePower= obj.horsePower;
    //     this->maxSpeed= obj.maxSpeed;
    //     this->motionStatus= obj.motionStatus;
    //     this->numberOfGears=obj.numberOfGears;
    // }
    
    // ******Copy Constructor  { Deep Copy }
    Cars(Cars &obj)
    {
        cout<<"\n  Copy Constructor called  \n";
        
        // Allocate new memory then copy
        this->numberOfGears = new int;
        
        this->Modal= obj.Modal;
        this->Color= obj.Color;
        this->horsePower= obj.horsePower;
        this->maxSpeed= obj.maxSpeed;
        this->motionStatus= obj.motionStatus;
        
        *this->numberOfGears=*obj.numberOfGears;
    }
    
    //****************** Destructor *********************//
    ~Cars()
    {
        cout<<"\n D.E.S.T.R.U.C.T"<<endl;
    }
    
};

int main()
{

    Cars firstCar;                          //  Default Constructor will be called 
    Cars secondCar("Cz2013","Red",40,120,5);  //  Parameterized Constructor will be called
    Cars thirdCar( secondCar );             //  Copy Constructor will be called;
    
    
    cout<<"\n "<<secondCar.getNumberOfGears()<<"\n";
    cout<<"\n "<<thirdCar.getNumberOfGears()<<"\n";
    
    *secondCar.numberOfGears = 7;
    
    cout<<"\n "<<secondCar.getNumberOfGears()<<"\n";
    cout<<"\n "<<thirdCar.getNumberOfGears()<<"\n";


    return 0;
}