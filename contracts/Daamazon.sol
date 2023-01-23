// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Daamazon {
    
    address public owner;

    struct Item{
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }
mapping(uint256 =>Item)public items;
constructor(){
owner=msg.sender;

}
function list (
uint256 _id,
string memory _name,
string memory _category,
string memory _image,
uint256 _cost,
uint256 _rating,
uint256 _stock)public{
   

Item memory item=Item(
_id,
_name,
_category,
_image,
_cost,
_rating,
_stock);

items[_id]=item;




}




}
