using AutoMapper;
using Core.Entities;
using API.Dtos;
using Microsoft.Extensions.Configuration;
using System;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class OrderItemUrlResolver : IValueResolver<OrderItem, OrderItemDto, string>
    {
        private readonly IConfiguration _config;
        public OrderItemUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(OrderItem source, OrderItemDto destination, string destMember, ResolutionContext context)
        {
            if(!String.IsNullOrEmpty(source.ItemOrdered.PictureUrl))
            {
                return _config["AppUrl"] + source.ItemOrdered.PictureUrl;
            }

            return null;
        }
    }
}