#include <iostream>
using namespace std;

// static data members:     ->  These are the data members that belongs to the class
//                          ->  i.e they can be accessed even without the creation of Object
//                          ->  It is initialized before any object of this class is being created, even before main starts.

// static member function   ->  No need to create class
//                          ->  These dont have this keyword
//                          ->  Can access only static data members

class box {
    private:
    	int length;
    	int* breadth;
    	int height;
    
    public:
        // declaration of static data member
        static int area;
        
    	box()
    	{
    		breadth = new int;
    	}
    	box(box& sample)
    	{
    		length = sample.length;
    		breadth = new int;
    		*breadth = *(sample.breadth);
    		height = sample.height;
    	}
    	
    	void set_dimension(int len, int brea,int heig)
    	{
    		length = len;
    		*breadth = brea;
    		height = heig;
    	}
    	void show_data()
    	{
    		cout << " Length = " << length
    			<< "\n Breadth = " << *breadth
    			<< "\n Height = " << height
    			<< endl;
    	}
    	
    	static int viewArea(int k)
    	{
    	    cout<<"Area is -> "<<area + k<<endl;
    	    area = k;
    	    return 10;
    	}
    
    	~box()
    	{
    		delete breadth;
    	}
};

// defination of static data member
int box :: area;

int main()
{

	box first;
	first.set_dimension(12, 14, 16);
	first.show_data();
	
	// initialization of static data member
	box :: area = 100;
	
    first.viewArea(5);
    
    cout<<box::area<<endl;
    
    first.viewArea(5);

	return 0;
}
