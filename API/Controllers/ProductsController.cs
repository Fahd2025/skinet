using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IGenericRepository<Product> _repoProduct;
        private readonly IGenericRepository<ProductBrand> _repoProductBrand;
        private readonly IGenericRepository<ProductType> _repoProductType;
         private readonly IMapper _mapper;
        public ProductsController(IGenericRepository<Product> repoProduct, 
        IGenericRepository<ProductBrand> repoProductBrand,       
        IGenericRepository<ProductType> repoProductType, IMapper mapper)
        {
            _mapper = mapper;
            _repoProduct = repoProduct;
            _repoProductBrand = repoProductBrand;
            _repoProductType = repoProductType;
        }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductReturnToDto>>> GetProducts()
    {
        var spec = new ProductsWithTypesAndBrandsSpecification();
        var products = await _repoProduct.ListAsync(spec);
        return Ok(_mapper.Map<IReadOnlyList<ProductReturnToDto>>(products));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductReturnToDto>> GetProduct(int id)
    {
        var spec = new ProductsWithTypesAndBrandsSpecification(id);
        var product = await _repoProduct.GetEntityWithSpec(spec);
        return Ok(_mapper.Map<ProductReturnToDto>(product));
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
    {
        var brands = await _repoProductBrand.ListAllAsync();
        return Ok(brands);
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
    {
        var types = await _repoProductType.ListAllAsync();
        return Ok(types);
    }
}
}