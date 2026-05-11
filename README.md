# SWE 1 final project repo

# Basic
* This system is meant for combining multiple, currently separate, systems that cover marking the attendance
of children on specific days and what meals should be ordered on those specific days. This is meant to have
accurate meal orders for both children without any dietary limitations and children who do have dietary
limitations. 

# Requirements & Dependencies

* Docker Engine with Docker Compose
* NodeJS v20.20.2 or later and compatible NPM

If Docker is not available or can not be used, it can be replaced with an installation of the latest version of PostgreSQL.

# Install & Deploy

## Database:

Run docker compose 

## Backend:

1. Ensure that PostgreSQL is installed 

# Usage

*	Super User
There is one super user with access to everything for the purpose of installing and setting the system up. This user with expanded rights and access is to be used only when installing the system.

*	Parents
Parents can register for an account on the web page. [include if exists]Upon registration, they can send a message to the system Administrator, that they have a child they would like to take part in the kindergarten’s activities. The admin would then Create the entity in the database for the child in question, and appoint the parent-user as the parent of that child and give access to read and to update information regarding the child, such as marking attendances.[end]

*	Kindergarten staff
Users with Staff-level rights and access can make notations about notable events that happened during a day. [include if exists]Staff can send messages to Parent-users.[end]

*	System Administrator
The administrator can do all the CRUD-activities for different users; create users for new staff, read data saved in the system, update staff information or child information when required and delete entities when required. [include if exists]Administrator can send messages to parents about their child’s well-being or if anything notable has occurred during the day.[end]
