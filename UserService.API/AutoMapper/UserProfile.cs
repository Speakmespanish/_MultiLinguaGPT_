using AutoMapper;
using UserService.API.DTOs;
using UserService.Core.Entities;

namespace UserService.API.AutoMapper
{
    public class UserProfile : Profile
    {
        public UserProfile ()
        {
            //Mapping from User to UserDTO Then from UserDTO to User with ReverseMap
            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.LanguagePreference, opt => opt.MapFrom(src => src.LanguagePreference))
                .ForMember(dest => dest.UserType, opt => opt.MapFrom(src => src.UserType))
                .ReverseMap();


            CreateMap<User, UserCreateDTO>();
            CreateMap<UserCreateDTO, User>();

            CreateMap<User, UserUpdateDTO>();
            CreateMap<UserUpdateDTO, User>();
        }
    }
}
