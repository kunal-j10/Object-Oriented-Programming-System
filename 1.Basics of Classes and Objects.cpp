#include <iostream>
using namespace std;


// OOPs : Object Oriented Programming System


// OOPs is a Programming methodlogy which helps us to write clean, reusable and easily understandable code,
// using OOP we write code as representations from real-world object which has some properties and behaviours,
// hence, making it very easy to understand and manage code.


// Benifits of using OOPs :-
//              -> Increase Readiblity
//              -> Increase Reusability
//              -> Easily Managable
//              -> Increase Extensibility


// Class :  ->  It is just like a blueprint for real-world Objects, which can be used to create a number of objects having some
//              properties and behaviours.
//
//          ->  In Programming, Class is a user defined Data type which has some data members and member functions,
//              a class does not occupy any space in memory but as soon as an object is created, memory space is 
//              alocated for that object.


// Object : ->  An Object is an instance of a class, i.e Objects are the real world entities having some  behaviour 
//              and properties as enlisted in the blueprint ( CLASS ).



// Class : userdefined Datatype / blueprint
class Cars
{
    //  By default all data-members are private in a Class
    //  Access Modifiers
    public:
    
    // Data Members
    string Modal;
    string Color;
    string motionStatus;
    int horsePower;
    int maxSpeed;
    
    
    // Member functions
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
        this->Color=val;
    }
    void setHorsePower(int val)
    {
        this->horsePower=val;
    }
    void setMaxSpeed(int val)
    {
        this->maxSpeed=val;
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
    
};

int main()
{
    // Declaration of Object
    Cars firstCar; //firstCar in an Object i.e  instance of class Cars
    
    firstCar.moveForward();
    firstCar.turnRight();
    
    firstCar.setMaxSpeed(100);
    firstCar.setModal("Audi");
    
    cout<<"\n "<<firstCar.getModal()<<"\n";
    cout<<"\n "<<firstCar.getMaxSpeed()<<"\n";
    cout<<"\n "<<firstCar.getMotionStatus()<<"\n";

    return 0;
}